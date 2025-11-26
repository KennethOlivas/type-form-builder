import Form from "@/components/form";
import { getPublicFormById } from "@/actions/form-actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const form = await getPublicFormById(id);

  if (!form.success || !form.data) {
    return {
      title: "Form Not Found",
    };
  }

  return {
    title: form.data.title,
    description: form.data.description || "Please fill out this form.",
    openGraph: {
      title: form.data.title,
      description: form.data.description || "Please fill out this form.",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: form.data.title,
      description: form.data.description || "Please fill out this form.",
    },
  };
}

export default async function FormBuilderPage({
  params,
}: Props) {
  const { id } = await params;
  const result = await getPublicFormById(id);

  if (!result.success) {
    if (result.error === "Form is not published") {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="text-xl">Form Not Available</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This form is currently not published or has been closed.
              </p>
              <p className="text-sm text-muted-foreground">
                Please contact the form owner if you believe this is a mistake.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
    return notFound();
  }

  return <Form id={id} initialData={result.data} />;
}
