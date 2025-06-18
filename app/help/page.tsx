"use client"
import Link from "next/link"
import { ArrowLeft, HelpCircle, MessageCircle, CreditCard, Settings, Smartphone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function HelpPage() {
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
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Help Center
            </h1>
            <p className="text-gray-400 text-lg">
              Find answers to common questions and get support
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 space-y-8">
          
          {/* Quick Help Categories */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Help</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#1a0a24] rounded-lg p-6 text-center">
                <MessageCircle className="h-8 w-8 text-pink-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Chat & Characters</h3>
                <p className="text-gray-400 text-sm">Learn how to chat with AI companions and create characters</p>
              </div>
              <div className="bg-[#1a0a24] rounded-lg p-6 text-center">
                <CreditCard className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Billing & Premium</h3>
                <p className="text-gray-400 text-sm">Manage your subscription and premium features</p>
              </div>
              <div className="bg-[#1a0a24] rounded-lg p-6 text-center">
                <Settings className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Account Settings</h3>
                <p className="text-gray-400 text-sm">Update your profile and privacy preferences</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              
              {/* Getting Started */}
              <AccordionItem value="getting-started" className="bg-[#1a0a24] rounded-lg border-none">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-pink-400">
                  How do I get started with Lumilove?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  <div className="space-y-3">
                    <p>Getting started is easy:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-4">
                      <li>Create your free account with email verification</li>
                      <li>Browse our character gallery or create your own AI companion</li>
                      <li>Start chatting immediately with free messages</li>
                      <li>Upgrade to Premium for unlimited conversations and advanced features</li>
                    </ol>
                    <p className="text-pink-400 text-sm">💡 Tip: Start with our featured characters to get familiar with the platform!</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Character Creation */}
              <AccordionItem value="character-creation" className="bg-[#1a0a24] rounded-lg border-none">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-pink-400">
                  How do I create my own AI character?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  <div className="space-y-3">
                    <p>Creating a custom character involves several steps:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Appearance:</strong> Choose visual style, body type, and physical features</li>
                      <li><strong>Personality:</strong> Select personality traits that define their behavior</li>
                      <li><strong>Background:</strong> Add occupation, interests, and backstory</li>
                      <li><strong>Voice & Style:</strong> Customize how they speak and interact</li>
                      <li><strong>Privacy:</strong> Choose whether to keep them private or share publicly</li>
                    </ul>
                    <p className="text-purple-400 text-sm">🎨 The more detailed your character, the more realistic their conversations will be!</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Premium Features */}
              <AccordionItem value="premium-features" className="bg-[#1a0a24] rounded-lg border-none">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-pink-400">
                  What do I get with Premium subscription?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  <div className="space-y-3">
                    <p>Premium unlocks advanced features:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Chat Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Unlimited messages</li>
                          <li>Faster response times</li>
                          <li>Memory of longer conversations</li>
                          <li>Voice messages (coming soon)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Creation Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Create unlimited characters</li>
                          <li>Advanced customization options</li>
                          <li>Priority character generation</li>
                          <li>Exclusive content packs</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-green-400 text-sm">💎 Premium starts at $9.99/month with a 7-day free trial!</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Privacy & Safety */}
              <AccordionItem value="privacy-safety" className="bg-[#1a0a24] rounded-lg border-none">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-pink-400">
                  Is my data and conversations private?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  <div className="space-y-3">
                    <p>We take your privacy seriously:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Private by default:</strong> Your conversations are not shared with other users</li>
                      <li><strong>Encrypted storage:</strong> All data is encrypted and securely stored</li>
                      <li><strong>No selling data:</strong> We never sell your personal information</li>
                      <li><strong>AI improvement:</strong> Only anonymized data is used to improve our models</li>
                      <li><strong>Account deletion:</strong> You can delete your account and data anytime</li>
                    </ul>
                    <p className="text-blue-400 text-sm">🔒 Read our full Privacy Policy for detailed information.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Technical Issues */}
              <AccordionItem value="technical-issues" className="bg-[#1a0a24] rounded-lg border-none">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-pink-400">
                  I'm having technical problems. What should I do?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  <div className="space-y-3">
                    <p>Try these troubleshooting steps:</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Common Solutions</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                          <li>Refresh your browser or restart the app</li>
                          <li>Clear your browser cache and cookies</li>
                          <li>Check your internet connection</li>
                          <li>Update to the latest browser version</li>
                          <li>Disable browser extensions temporarily</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Still Having Issues?</h4>
                        <p className="text-sm">Contact our support team with:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                          <li>Description of the problem</li>
                          <li>Browser/device information</li>
                          <li>Screenshots if applicable</li>
                          <li>Steps to reproduce the issue</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Billing Issues */}
              <AccordionItem value="billing-issues" className="bg-[#1a0a24] rounded-lg border-none">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-pink-400">
                  How do I manage my subscription or get a refund?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Subscription Management</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Go to Profile → Subscription Settings</li>
                        <li>View your current plan and billing history</li>
                        <li>Cancel or change your subscription anytime</li>
                        <li>Update payment methods securely</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">Refund Policy</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>7-day free trial for new Premium users</li>
                        <li>Full refund within 14 days of first purchase</li>
                        <li>Pro-rated refunds for annual subscriptions</li>
                        <li>Contact support for refund requests</li>
                      </ul>
                    </div>
                    <p className="text-yellow-400 text-sm">💳 All payments are processed securely through Stripe.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Content Guidelines */}
              <AccordionItem value="content-guidelines" className="bg-[#1a0a24] rounded-lg border-none">
                <AccordionTrigger className="px-6 py-4 text-white hover:text-pink-400">
                  What are the content guidelines and restrictions?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-300">
                  <div className="space-y-3">
                    <p>We maintain a safe environment for all users:</p>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Allowed Content</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                          <li>Romantic and intimate conversations (18+ only)</li>
                          <li>Fantasy and role-playing scenarios</li>
                          <li>Creative storytelling and adventures</li>
                          <li>Emotional support and companionship</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Prohibited Content</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                          <li>Content involving minors or underage scenarios</li>
                          <li>Non-consensual or violent content</li>
                          <li>Hate speech or discrimination</li>
                          <li>Illegal activities or harmful behavior</li>
                          <li>Sharing personal information of real people</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-red-400 text-sm">⚠️ Violations may result in account suspension or termination.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </section>

          {/* Contact Support */}
          <section>
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-6 text-center">
              <Mail className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Still Need Help?</h3>
              <p className="text-gray-300 mb-6">
                Our support team is here to help you with any questions or issues.
              </p>
              <div className="space-y-3">
                <div className="bg-[#1a0a24] rounded-lg p-4">
                  <p className="text-white font-medium">Email Support</p>
                  <p className="text-pink-400">support@lumilove.ai</p>
                  <p className="text-gray-400 text-sm">Response within 24-48 hours</p>
                </div>
                <div className="bg-[#1a0a24] rounded-lg p-4">
                  <p className="text-white font-medium">Live Chat</p>
                  <p className="text-purple-400">Available 9 AM - 6 PM EST</p>
                  <p className="text-gray-400 text-sm">Premium users get priority support</p>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile App Info */}
          <section>
            <div className="bg-[#1a0a24] rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Smartphone className="h-6 w-6 text-green-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Mobile App</h3>
              </div>
              <div className="text-gray-300 space-y-2">
                <p>Our mobile app is coming soon! Features will include:</p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li>Push notifications for new messages</li>
                  <li>Offline character creation</li>
                  <li>Voice chat capabilities</li>
                  <li>Enhanced privacy controls</li>
                </ul>
                <p className="text-blue-400 text-sm">📱 Sign up for our newsletter to be notified when it launches!</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Can't find what you're looking for? Contact our support team for personalized assistance.
          </p>
        </div>
      </div>
    </div>
  )
} 