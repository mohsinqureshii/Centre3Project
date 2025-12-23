import { Visitor } from '@/lib/centre3Types';

export default function VisitorsTable({ visitors }: { visitors: Visitor[] }) {
  if (!visitors || visitors.length === 0) {
    return <p>No visitors</p>;
  }

  return (
    <table className="w-full border mt-2">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Name</th>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Company</th>
        </tr>
      </thead>

      <tbody>
        {visitors.map((v, i) => (
          <tr key={i} className="border-t">
            <td className="p-2">{v.fullName}</td>
            <td className="p-2">{v.idNumber}</td>
            <td className="p-2">{v.company || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
