/** 아직 포팅하지 않은 페이지의 임시 스텁 — 각 Phase에서 실제 페이지로 교체한다 */
export default function Placeholder({ label }: { label: string }) {
  return (
    <section className="container" style={{ padding: '80px 0' }}>
      <p>{label} 페이지 준비 중입니다.</p>
    </section>
  );
}
