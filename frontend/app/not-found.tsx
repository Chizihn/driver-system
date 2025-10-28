import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Home, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Government Seal */}
          <div className="mx-auto w-20 h-20 bg-government-green rounded-full flex items-center justify-center text-white shadow-lg">
            <Shield className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center text-amber-500">
              <AlertCircle className="w-16 h-16" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">
              404 - Page Not Found
            </CardTitle>
            <CardDescription className="text-base text-slate-600">
              The page you are looking for does not exist or has been moved.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          <div className="text-center space-y-2 text-sm text-slate-500">
            <p>
              You may have mistyped the address or the page has been removed.
            </p>
            <p className="font-medium text-government-green">
              Federal Republic of Nigeria • Driver Verification System
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="flex-1 bg-government-green hover:bg-green-700"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link
                href="/verify"
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Verify Driver
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500">
              If you believe this is an error, contact your system
              administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
