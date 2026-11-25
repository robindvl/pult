import { OrgCard } from "@/components/OrgCard";
import {
  blockLabels,
  company,
  conveyorBlocks,
  roles,
  type ConveyorBlock,
} from "@/data/mock";

export default function OrgPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-stone-500">{company.name}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
          Функции конвейера
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Три блока компании: изменения, операции, штаб. У каждой функции —
          ценный конечный продукт (что должна выдавать), статус роли и риск,
          если функция «провисает».
        </p>
      </header>

      {conveyorBlocks.map((block: ConveyorBlock) => {
        const blockRoles = roles.filter((r) => r.block === block);
        return (
          <section key={block} className="space-y-3">
            <h2 className="text-lg font-semibold text-stone-900">
              {blockLabels[block]}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {blockRoles.map((role) => (
                <OrgCard key={role.id} role={role} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
