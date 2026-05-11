export default function MaintenancePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-6">🔧</div>
      <h1 className="text-3xl font-bold mb-3">ปิดปรับปรุงชั่วคราว</h1>
      <p className="text-(--muted-foreground) max-w-sm">
        เว็บไซต์ D-Calc กำลังอยู่ระหว่างการปรับปรุง กรุณาลองใหม่อีกครั้งในภายหลัง
      </p>
      <p className="text-sm text-(--muted-foreground) mt-2">
        We&apos;ll be back shortly. Thank you for your patience.
      </p>
    </div>
  );
}
