import type { Metadata } from "next";
import Link from "next/link";
import { PolicyLayout, PolicySection } from "@/components/layout/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | D-Calc",
  description: "Privacy Policy of D-Calc — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      subtitle="นโยบายความเป็นส่วนตัว"
    >
      <PolicySection title="1. Overview · ภาพรวม">
        <p>
          D-Calc (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates this website to provide free online calculation tools.
          This Privacy Policy explains what information we collect, how we use it, and your choices.
        </p>
        <p className="text-indigo-600 dark:text-indigo-400 text-xs">
          D-Calc ให้บริการเครื่องคำนวณออนไลน์ฟรี นโยบายนี้อธิบายว่าเราเก็บข้อมูลอะไร ใช้อย่างไร และสิทธิ์ของคุณมีอะไรบ้าง
        </p>
      </PolicySection>

      <PolicySection title="2. Information We Collect · ข้อมูลที่เราเก็บ">
        <ul className="list-disc pl-4 space-y-2">
          <li><strong className="text-foreground">Usage data:</strong> Pages visited, calculator tools used, browser type, device type (collected anonymously).</li>
          <li><strong className="text-foreground">Local Storage:</strong> Calculator inputs stored in your browser locally — never sent to our servers.</li>
          <li><strong className="text-foreground">Log data:</strong> Anonymous event logs (e.g., which calculator was used) stored in our database without any PII.</li>
        </ul>
        <p className="text-xs">เราไม่เก็บข้อมูลส่วนบุคคล เช่น ชื่อ อีเมล หรือหมายเลข IP เพื่อระบุตัวตน</p>
      </PolicySection>

      <PolicySection title="3. Cookies & Advertising · คุกกี้และโฆษณา">
        <p>
          We use <strong className="text-foreground">Google AdSense</strong> to display advertisements. Google and its partners may use cookies
          to serve ads based on your prior visits to this or other websites.
        </p>
        <ul className="list-disc pl-4 space-y-1.5">
          <li>You may opt out of personalized ads at <Link href="https://www.google.com/settings/ads" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</Link>.</li>
          <li>Third-party opt-out: <Link href="http://www.networkadvertising.org/managing/opt_out.asp" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">NAI Opt-Out</Link>.</li>
        </ul>
        <p className="text-xs">เว็บไซต์นี้ใช้ Google AdSense คุณสามารถปิดโฆษณา personalized ได้ที่ Google Ads Settings</p>
      </PolicySection>

      <PolicySection title="4. Third-Party Services · บริการของบุคคลที่สาม">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-(--muted)">
                <th className="text-left px-3 py-2 border border-(--border) text-foreground">Service</th>
                <th className="text-left px-3 py-2 border border-(--border) text-foreground">Purpose</th>
                <th className="text-left px-3 py-2 border border-(--border) text-foreground">Policy</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Google AdSense", purpose: "Display advertising", link: "https://policies.google.com/privacy", label: "Google" },
                { name: "Supabase", purpose: "Anonymous analytics", link: "https://supabase.com/privacy", label: "Supabase" },
                { name: "Vercel", purpose: "Web hosting", link: "https://vercel.com/legal/privacy-policy", label: "Vercel" },
              ].map((s) => (
                <tr key={s.name}>
                  <td className="px-3 py-2 border border-(--border) font-medium text-foreground">{s.name}</td>
                  <td className="px-3 py-2 border border-(--border)">{s.purpose}</td>
                  <td className="px-3 py-2 border border-(--border)">
                    <Link href={s.link} className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">{s.label}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PolicySection>

      <PolicySection title="5. Data Retention · การเก็บรักษาข้อมูล">
        <p>Anonymous usage logs are retained for up to 12 months for analytics purposes, then deleted.</p>
        <p className="text-xs">ข้อมูล log แบบ anonymous จะเก็บไว้สูงสุด 12 เดือนเพื่อวัตถุประสงค์ด้านการวิเคราะห์ แล้วจะถูกลบออก</p>
      </PolicySection>

      <PolicySection title="6. Children's Privacy · ความเป็นส่วนตัวของเด็ก">
        <p>This website is not directed at children under 13. We do not knowingly collect information from children.</p>
        <p className="text-xs">เว็บไซต์นี้ไม่ได้มุ่งเป้าไปที่เด็กอายุต่ำกว่า 13 ปี</p>
      </PolicySection>

      <PolicySection title="7. Your Rights · สิทธิ์ของคุณ">
        <ul className="list-disc pl-4 space-y-1">
          <li>Opt out of personalized advertising</li>
          <li>Clear your browser localStorage at any time</li>
          <li>Request information about data we hold</li>
        </ul>
      </PolicySection>

      <PolicySection title="8. Contact · ติดต่อเรา">
        <p>For privacy-related questions, please contact us via the email on our domain registration (WHOIS).</p>
        <p className="text-xs">หากมีคำถามเกี่ยวกับนโยบายนี้ ติดต่อได้ทางอีเมลที่ระบุในการลงทะเบียนโดเมน</p>
      </PolicySection>
    </PolicyLayout>
  );
}
