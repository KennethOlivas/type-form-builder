import { Builder } from "@/components/builder";

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
