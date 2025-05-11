// This can be identical to /disclaimer/page.tsx or have specific legal phrasing.
// For this example, we'll make it very similar but adjust the title slightly.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel } from "lucide-react"; // Using Gavel for legal icon

export default function LegalDisclaimerPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Gavel className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Legal Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert mx-auto">
          <p>
            This Legal Disclaimer governs your use of the Content Compass platform. By accessing or using our services,
            you agree to the terms outlined in this disclaimer.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">No Legal Advice</h2>
          <p>
            The information provided on Content Compass is for general informational purposes only. It is not intended as,
            and should not be construed as, legal advice. You should consult with a qualified legal professional for
            advice regarding any particular legal matter.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Intellectual Property</h2>
          <p>
            All content available on Content Compass, including text, graphics, logos, icons, images, audio clips, video clips,
            and software, is the property of Content Compass or its content suppliers and protected by international
            copyright laws. The compilation of all content on this site is the exclusive property of Content Compass.
            References to third-party trademarks or copyrighted material are for identification purposes only and do not
            imply endorsement or affiliation.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Accuracy and Completeness</h2>
          <p>
            Content Compass endeavors to provide accurate and up-to-date information. However, we make no warranties or
            representations as to the accuracy, completeness, or reliability of any information provided.
            Use of the information on this platform is at your own risk.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Content and Links</h2>
          <p>
            Content Compass may display content sourced from third parties or provide links to third-party websites.
            We are not responsible for the accuracy, legality, or appropriateness of third-party content or
            the practices of third-party websites. Accessing third-party links is at your own risk.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Modifications to Disclaimer</h2>
          <p>
            Content Compass reserves the right to modify this Legal Disclaimer at any time. We encourage you to review
            this page periodically for any changes. Your continued use of the platform after a modification
            constitutes your acceptance of the revised disclaimer.
          </p>
          
          <p className="mt-6">
            If you have any questions regarding this Legal Disclaimer, please contact us through our designated channels.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
