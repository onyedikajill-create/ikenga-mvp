"use client"

import { useState } from "react"
import { User, Bell, Shield, CreditCard, Palette, Globe, Key, LogOut, Save, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-card border border-border flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Key className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  JD
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+44 7123 456789" className="bg-background" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Employment Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employer">Current/Former Employer</Label>
                    <Input id="employer" placeholder="Company Name" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" placeholder="Your job title" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Employment Start Date</Label>
                    <Input id="startDate" type="date" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Employment End Date</Label>
                    <Input id="endDate" type="date" className="bg-background" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Case Updates</p>
                    <p className="text-sm text-muted-foreground">Notifications about your case progress</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Deadline Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders before important deadlines</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Document Alerts</p>
                    <p className="text-sm text-muted-foreground">When new documents are generated or uploaded</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing & Tips</p>
                    <p className="text-sm text-muted-foreground">Product updates and helpful tips</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" className="bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" className="bg-background" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-red-500/50">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/30">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Free Plan</h3>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">1 active case, basic features</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">Upgrade to Pro</Button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-muted/50 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pro Monthly</CardTitle>
                    <div className="text-2xl font-bold text-primary">£9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Unlimited cases</li>
                      <li>• Full evidence vault</li>
                      <li>• AI forensic analysis</li>
                      <li>• Document generator</li>
                    </ul>
                    <Button className="w-full mt-4" variant="outline">Select Plan</Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border-primary">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Pro Annual</CardTitle>
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Save 34%</Badge>
                    </div>
                    <div className="text-2xl font-bold text-primary">£79<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Everything in Monthly</li>
                      <li>• Priority support</li>
                      <li>• IKENGA content studio</li>
                      <li>• Early access to features</li>
                    </ul>
                    <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Select Plan</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Manage your payment details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No payment method on file</p>
                <Button className="mt-4" variant="outline">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your connected social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-600 text-white">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black text-white">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">X (Twitter)</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Facebook</p>
                    <p className="text-sm text-muted-foreground">Not connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API access for integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No API keys generated</p>
                <p className="text-sm mt-1">API access available on Pro plan</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
