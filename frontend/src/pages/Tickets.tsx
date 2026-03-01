import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import * as React from "react";

export default function Tickets() {

    const createTickets = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

        const formEl = e.currentTarget;
        const form = new FormData(formEl)

        try {
            const data = {
                description: String(form.get("description") ?? ""),
                subject: String(form.get("subject") ?? ""),
                companyName: String(form.get("companyName") ?? ""),
                email: String(form.get("email") ?? ""),
                phone: String(form.get("phone") ?? ""),
            };

            const response = await fetch("http://localhost:8080/api/v1/tickets", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(data)

        });
         if (!response.ok) {
             throw new Error(await response.text());}

         formEl.reset();
        } catch (error) {
        console.error(error)}
    }

    return (
                <form onSubmit={createTickets}>
                    <Field>
                    <FieldDescription>Firmanavn</FieldDescription>
                    <Input name="companyName"/>

                    <FieldDescription>Emne</FieldDescription>
                    <Input name="subject"/>

                    <FieldDescription>Beskrivelse</FieldDescription>
                    <Input name="description"/>

                    <FieldDescription>E-post</FieldDescription>
                    <Input name="email"/>

                    <FieldDescription>Telefon</FieldDescription>
                    <Input name="phone"/>
                    <FieldLabel></FieldLabel>
                    <Button type="submit">Submit</Button>
                </Field>

                </form>

    );

}