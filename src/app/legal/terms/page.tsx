import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileText className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert mx-auto">
          <p>
            Welcome to Content Compass! These Terms of Service ("Terms") govern your access to and use of the
            Content Compass website, applications, and services (collectively, the "Service"). Please read these
            Terms carefully before using the Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy.
            If you do not agree to these Terms, do not use the Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">2. Use of the Service</h2>
          <p>
            Content Compass grants you a limited, non-exclusive, non-transferable, revocable license to use
            the Service for your personal, non-commercial use. You agree not to use the Service for any
            unlawful purpose or in any way that violates these Terms.
          </p>
          <p>
            You are responsible for any activity that occurs through your account and you agree you will not
            sell, transfer, license or assign your account, followers, username, or any account rights.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">3. User Accounts</h2>
          <p>
            To access certain features of the Service, you may be required to create an account. You agree to
            provide accurate, current, and complete information during the registration process and to update
            such information to keep it accurate, current, and complete. You are responsible for safeguarding
            your password.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">4. Content</h2>
          <p>
            The Service provides access to information about movies, series, and other media ("Content"). This
            Content is sourced from public APIs and third-party providers. While Content Compass strives for
            accuracy, we do not guarantee the accuracy, completeness, or timeliness of the Content.
          </p>
          <p>
            The actual media files are hosted by third parties, and Content Compass is not responsible for their
            availability or legality. Your interaction with any Content is at your own risk.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">5. User-Generated Content</h2>
          <p>
            If you post reviews, comments, or other content ("User Content"), you grant Content Compass a
            non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use,
            reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and
            display such User Content throughout the world in any media.
          </p>
          <p>
            You represent and warrant that you own or otherwise control all of the rights to the User Content
            that you post; that the User Content is accurate; and that use of the User Content you supply
            does not violate these Terms and will not cause injury to any person or entity.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">6. Prohibited Conduct</h2>
          <p>
            You agree not to engage in any of the following prohibited activities:
            (i) copying, distributing, or disclosing any part of the Service in any medium;
            (ii) using any automated system, including "robots," "spiders," "offline readers," etc., to access the Service;
            (iii) transmitting spam, chain letters, or other unsolicited email;
            (iv) attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">7. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or
            liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">8. Disclaimers and Limitation of Liability</h2>
          <p>
            The Service is provided "AS IS" and "AS AVAILABLE". Content Compass disclaims all warranties of
            any kind, express or implied. We do not warrant that the Service will be uninterrupted, secure,
            or error-free.
          </p>
          <p>
            In no event shall Content Compass be liable for any indirect, incidental, special, consequential,
            or punitive damages.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
            without regard to its conflict of law provisions.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            We will provide notice of any changes by posting the new Terms on this page.
          </p>

          <p className="mt-6">
            If you have any questions about these Terms, please contact us.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
