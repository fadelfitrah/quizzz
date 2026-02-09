export default function Progress({ current, total }) {
  return (
    <p className="progress">
      <i class="ri-list-check-3" /> Soal {current} dari {total}
    </p>
  );
}
