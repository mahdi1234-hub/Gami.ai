import { useState } from 'react'
import { mockTeamMembers } from '../../lib/mock-data'
import { formatDate, cn } from '../../lib/utils'
import { toast } from 'sonner'
import { Users, Plus, Mail, Shield, Crown, X } from 'lucide-react'

export function TeamMembersPage() {
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')

  const handleInvite = () => {
    toast.success(`Invitation sent to ${inviteEmail}`)
    setShowInvite(false)
    setInviteEmail('')
  }

  const roleIcons: Record<string, typeof Crown> = { owner: Crown, admin: Shield, member: Users }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Team Members</h1>
          <p className="text-surface-500 mt-1">{mockTeamMembers.length} members</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-brand"><Plus className="w-4 h-4" /> Invite Member</button>
      </div>

      {showInvite && (
        <div className="glass-card p-6">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Invite Team Member</h3>
              <button onClick={() => setShowInvite(false)} className="p-1 hover:bg-surface-100 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Email address" className="input-field pl-10" />
              </div>
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="input-field w-auto">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={handleInvite} className="btn-brand">Send</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {mockTeamMembers.map((member) => {
          const RoleIcon = roleIcons[member.role] || Users
          return (
            <div key={member.id} className="glass-card p-4">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold">
                    {member.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.user.name}</p>
                    <p className="text-xs text-surface-500">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize',
                    member.role === 'owner' ? 'bg-amber-100 text-amber-700' :
                    member.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                    'bg-surface-200 text-surface-600'
                  )}>
                    <RoleIcon className="w-3 h-3" /> {member.role}
                  </span>
                  <span className="text-xs text-surface-400 hidden sm:block">Joined {formatDate(member.joinedAt)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
