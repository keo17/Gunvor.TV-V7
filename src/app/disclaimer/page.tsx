import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert mx-auto">
          <p>
            Welcome to Gunvor.TV. The content provided on this platform, including but not limited to movies,
            series, descriptions, and creator information, is for informational and entertainment purposes only.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">Accuracy of Information</h2>
          <p>
            While we strive to keep the information up to date and correct, we make no representations or
            warranties of any kind, express or implied, about the completeness, accuracy, reliability,
            suitability, or availability with respect to the website or the information, products, services,
            or related graphics contained on the website for any purpose. Any reliance you place on such
            information is therefore strictly at your own risk.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Content Availability</h2>
          <p>
            Gunvor.TV acts as a directory and discovery tool for media. The actual media files (videos, images)
            are hosted on third-party platforms (e.g., Cloudflare R2). We do not host any media content on our
            servers. Availability of content is subject to the terms and conditions of these third-party hosting
            providers. We are not responsible for content takedowns or unavailability from these external sources.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">External Links</h2>
          <p>
            Through this website, you may be able to link to other websites which are not under the control of
            Gunvor.TV. We have no control over the nature, content, and availability of those sites.
            The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed
            within them.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-2">User-Generated Content</h2>
          <p>
            Some features of Gunvor.TV may allow users to submit content, such as reviews or ratings.
            The views and opinions expressed in user-generated content are those of the authors and do not
            necessarily reflect the official policy or position of Gunvor.TV. We reserve the right to
            remove any user-generated content that violates our terms of service or is deemed inappropriate.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
          <p>
            In no event will we be liable for any loss or damage including without limitation, indirect or
            consequential loss or damage, or any loss or damage whatsoever arising from loss of data or
            profits arising out of, or in connection with, the use of this website.
          </p>
          
          <p className="mt-6">
            By using Gunvor.TV, you signify your acceptance of this disclaimer. If you do not agree to
            this disclaimer, please do not use our platform.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
