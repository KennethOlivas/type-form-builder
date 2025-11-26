import { Builder } from "@/components/builder";
import { getFormById } from "@/actions/form-actions";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  if (id === "new") {
    return {
      title: "New Form - Builder",
    };
  }

  const form = await getFormById(id);

  if (!form.success || !form.data) {
    return {
      title: "Builder",
    };
  }

  return {
    title: `Builder - ${form.data.title}`,
  };
}

export default async function FormBuilderPage({
  params,
}: Props) {
  const { id } = await params;
  const isNewForm = id === "new";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="relative z-10">
        <Builder id={id} isNewForm={isNewForm} />
      </div>
    </div>
  );
}
