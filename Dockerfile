FROM node:24-alpine AS frontend-build
WORKDIR /workspace/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /workspace

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src/ src/
COPY --from=frontend-build /workspace/frontend/dist/ src/main/resources/static/

RUN ./mvnw -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

ENV PORT=8080
EXPOSE 8080

COPY --from=backend-build /workspace/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
