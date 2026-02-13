import { CampaignForm } from '@/components/campaigns/CampaignForm'

export default function NewCampaignPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="pb-6 border-b border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Campaign</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-2xl">
          Set up a new review request automation campaign with custom messaging and channels.
        </p>
      </div>
      <CampaignForm />
    </div>
  )
}
