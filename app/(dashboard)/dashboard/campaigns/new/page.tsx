import { CampaignForm } from '@/components/campaigns/CampaignForm'

export default function NewCampaignPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Campaign</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new review request automation campaign
        </p>
      </div>
      <CampaignForm />
    </div>
  )
}
