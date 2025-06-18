"use client"
import Link from "next/link"
import { ArrowLeft, Lock, Eye, Database, Shield, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a24] to-[#2a1a34]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/login">
            <Button variant="ghost" className="mb-6 text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-[#1a0a24] to-[#2a1a34] flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-400 text-lg">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 space-y-8">
          
          {/* Section 1: Introduction */}
          <section>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-pink-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>
                At Lumilove, we respect your privacy and are committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you use our AI companion service.
              </p>
              <p>
                We are committed to transparency about our data practices and giving you control over your personal information.
              </p>
            </div>
          </section>

          {/* Section 2: Information We Collect */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <h3 className="text-xl font-semibold text-white">Account Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email address and username</li>
                <li>Password (encrypted and never stored in plain text)</li>
                <li>Profile preferences and settings</li>
                <li>Subscription and payment information</li>
              </ul>

              <h3 className="text-xl font-semibold text-white">Usage Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chat conversations with AI characters</li>
                <li>Character creation and customization data</li>
                <li>App usage patterns and feature interactions</li>
                <li>Device information and technical logs</li>
              </ul>

              <h3 className="text-xl font-semibold text-white">Automatically Collected Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and location data (for security and service optimization)</li>
                <li>Browser type and version</li>
                <li>Session duration and frequency of use</li>
                <li>Crash reports and error logs</li>
              </ul>
            </div>
          </section>

          {/* Section 3: How We Use Your Information */}
          <section>
            <div className="flex items-center mb-4">
              <UserCheck className="h-6 w-6 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">3. How We Use Your Information</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our AI companion service</li>
                <li>Personalize your experience and improve AI responses</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send important service updates and notifications</li>
                <li>Detect and prevent fraud, abuse, and security threats</li>
                <li>Analyze usage patterns to improve our service</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-6">
                <h4 className="text-blue-300 font-semibold mb-2">AI Training and Improvement</h4>
                <p className="text-blue-200 text-sm">
                  We may use anonymized conversation data to improve our AI models. Personal identifiers are removed, 
                  and this data is used solely to enhance the quality and safety of AI responses.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Data Sharing */}
          <section>
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">4. Information Sharing</h2>
            </div>
            <div className="text-gray-300 space-y-4">
              <p>We do NOT sell your personal data. We may share your information only in these limited circumstances:</p>
              
              <h3 className="text-xl font-semibold text-white">Service Providers</h3>
              <p>We work with trusted third-party service providers for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payment processing (Stripe, PayPal)</li>
                <li>Cloud hosting and data storage (AWS, Google Cloud)</li>
                <li>Analytics and performance monitoring</li>
                <li>Customer support tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-white">Legal Requirements</h3>
              <p>We may disclose information when required by law or to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with legal process or government requests</li>
                <li>Protect our rights, property, or safety</li>
                <li>Investigate potential violations of our terms</li>
                <li>Prevent fraud or security threats</li>
              </ul>
            </div>
          </section>

          {/* Section 5: Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <div className="text-gray-300 space-y-4">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>End-to-end encryption for sensitive data transmission</li>
                <li>Secure data storage with encryption at rest</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication protocols</li>
                <li>Employee training on data protection best practices</li>
              </ul>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-6">
                <h4 className="text-red-300 font-semibold mb-2">Important Security Note</h4>
                <p className="text-red-200 text-sm">
                  While we implement strong security measures, no system is 100% secure. 
                  Please use strong, unique passwords and enable two-factor authentication when available.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Privacy Rights</h2>
            <div className="text-gray-300 space-y-4">
              <p>You have the following rights regarding your personal data:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#1a0a24] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Access & Portability</h4>
                  <p className="text-gray-300 text-sm">Request a copy of your personal data in a portable format</p>
                </div>
                <div className="bg-[#1a0a24] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Correction</h4>
                  <p className="text-gray-300 text-sm">Update or correct inaccurate personal information</p>
                </div>
                <div className="bg-[#1a0a24] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Deletion</h4>
                  <p className="text-gray-300 text-sm">Request deletion of your personal data (subject to legal requirements)</p>
                </div>
                <div className="bg-[#1a0a24] rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Opt-Out</h4>
                  <p className="text-gray-300 text-sm">Withdraw consent for certain data processing activities</p>
                </div>
              </div>

              <p className="mt-4">
                To exercise these rights, please contact us at <span className="text-pink-400">privacy@lumilove.ai</span>
              </p>
            </div>
          </section>

          {/* Section 7: Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
            <div className="text-gray-300 space-y-4">
              <p>We retain your data for as long as necessary to provide our services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account data: Until you delete your account</li>
                <li>Chat conversations: Up to 2 years for service improvement</li>
                <li>Payment records: As required by financial regulations (typically 7 years)</li>
                <li>Analytics data: Anonymized and retained indefinitely</li>
              </ul>
            </div>
          </section>

          {/* Section 8: International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Your data may be processed in countries other than your own. We ensure adequate protection through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Standard contractual clauses approved by regulators</li>
                <li>Adequacy decisions for certain countries</li>
                <li>Certification schemes and binding corporate rules</li>
              </ul>
            </div>
          </section>

          {/* Section 9: Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Our service is intended for users 18 years and older. We do not knowingly collect personal information from children under 18. 
                If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </div>
          </section>

          {/* Section 10: Updates */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Policy Updates</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                We may update this privacy policy from time to time. We will notify you of significant changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a prominent notice in our app</li>
              </ul>
            </div>
          </section>

          {/* Section 11: Contact */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="bg-[#1a0a24] rounded-lg p-4 space-y-2">
                <p className="text-white font-medium">Email: privacy@lumilove.ai</p>
                <p className="text-white font-medium">Data Protection Officer: dpo@lumilove.ai</p>
                <p className="text-gray-400">We respond to privacy inquiries within 30 days</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Your privacy is important to us. This policy explains how we protect and use your information.
          </p>
        </div>
      </div>
    </div>
  )
} 