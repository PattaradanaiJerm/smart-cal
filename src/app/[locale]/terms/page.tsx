import type { Metadata } from "next";
import { PolicyLayout, PolicySection } from "@/components/layout/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms of Service | Smart Calculator",
  description: "Terms of Service for Smart Calculator.",
};

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      subtitle="ข้อกำหนดการใช้งาน"
    >
      <PolicySection title="1. Acceptance of Terms · การยอมรับข้อกำหนด">
        <p>By accessing or using Smart Calculator, you agree to be bound by these Terms of Service.</p>
        <p className="text-xs">การเข้าถึงหรือใช้งาน Smart Calculator ถือว่าคุณยอมรับข้อกำหนดเหล่านี้</p>
      </PolicySection>

      <PolicySection title="2. Description of Service · คำอธิบายบริการ">
        <p>Smart Calculator provides free online calculation tools including BMI, unit conversions, loan, GPA, calorie, and date calculators for personal and informational use.</p>
        <p className="text-xs">Smart Calculator ให้บริการเครื่องคำนวณออนไลน์ฟรีสำหรับการใช้งานส่วนบุคคลและเพื่อข้อมูลเท่านั้น</p>
      </PolicySection>

      <PolicySection title="3. Disclaimer · ข้อจำกัดความรับผิดชอบ">
        <p>Calculation results are for <strong className="text-foreground">informational purposes only</strong> and should <strong className="text-foreground">not</strong> be used as a substitute for professional financial, medical, or legal advice.</p>
        <p className="text-xs">ผลการคำนวณมีไว้เพื่อข้อมูลเท่านั้น ไม่ควรใช้แทนคำแนะนำจากผู้เชี่ยวชาญ</p>
      </PolicySection>

      <PolicySection title="4. Advertising · การโฆษณา">
        <p>This website displays advertisements served by Google AdSense. Advertisements are clearly separated from content. We do not endorse any advertised products or services.</p>
        <p className="text-xs">เว็บไซต์นี้แสดงโฆษณาผ่าน Google AdSense โฆษณาจะถูกแสดงแยกจากเนื้อหาอย่างชัดเจน</p>
      </PolicySection>

      <PolicySection title="5. Intellectual Property · ทรัพย์สินทางปัญญา">
        <p>All content, design, and code on this site are owned by Smart Calculator. You may not reproduce, distribute, or create derivative works without prior written permission.</p>
        <p className="text-xs">เนื้อหา การออกแบบ และโค้ดทั้งหมดเป็นทรัพย์สินของ Smart Calculator ห้ามทำซ้ำโดยไม่ได้รับอนุญาต</p>
      </PolicySection>

      <PolicySection title="6. Limitation of Liability · ข้อจำกัดความรับผิด">
        <p>To the maximum extent permitted by law, Smart Calculator shall not be liable for any indirect, incidental, or consequential damages arising from use of this service.</p>
        <p className="text-xs">Smart Calculator จะไม่รับผิดชอบต่อความเสียหายที่เกิดจากการใช้งานบริการ</p>
      </PolicySection>

      <PolicySection title="7. Changes to Terms · การเปลี่ยนแปลงข้อกำหนด">
        <p>We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        <p className="text-xs">เราสงวนสิทธิ์ในการแก้ไขข้อกำหนดได้ตลอดเวลา การใช้งานต่อเนื่องถือว่ายอมรับข้อกำหนดใหม่</p>
      </PolicySection>

      <PolicySection title="8. Governing Law · กฎหมายที่ใช้บังคับ">
        <p>These terms are governed by the laws of the Kingdom of Thailand.</p>
        <p className="text-xs">ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายของราชอาณาจักรไทย</p>
      </PolicySection>
    </PolicyLayout>
  );
}
