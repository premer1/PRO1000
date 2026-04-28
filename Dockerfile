FROM node:24-alpine AS frontend-build
WORKDIR /workspace/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM maven:3.9-eclipse-temurin-21-alpine AS backend-build
WORKDIR /workspace

COPY pom.xml ./
COPY src/ src/
COPY --from=frontend-build /workspace/frontend/dist/ src/main/resources/static/

RUN mvn -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

ENV PORT=8080
EXPOSE 8080

COPY --from=backend-build /workspace/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
