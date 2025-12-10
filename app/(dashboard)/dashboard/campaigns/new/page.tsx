import { CampaignForm } from '@/components/campaigns/CampaignForm'

export default function NewCampaignPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Campaign</h1>
        <p className="text-slate-600 mt-2 text-sm">
          Set up a new review request automation campaign
        </p>
      </div>
      <CampaignForm />
    </div>
  )
}
