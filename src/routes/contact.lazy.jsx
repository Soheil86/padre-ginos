import { useFormStatus } from "react-dom";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import postContact from "../api/postContact";

export const Route = createLazyFileRoute("/contact")({
  component: ContactRoute,
});

function ContactRoute() {
  const mutation = useMutation({
    mutationFn: (formData) =>
      postContact(
        formData.get("name"),
        formData.get("email"),
        formData.get("message"),
      ),
  });

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Submit"}
      </button>
    );
  }

  return (
    <div className="contact">
      <h2>Contact</h2>
      {mutation.isSuccess ? (
        <h3>Submitted!</h3>
      ) : (
        <form action={mutation.mutateAsync}>
          <input name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <textarea placeholder="Message" name="message"></textarea>
          <SubmitButton />
        </form>
      )}
    </div>
  );
}
