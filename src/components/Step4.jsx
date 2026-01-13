import { 
  ShieldCheck, User, Server, ShieldAlert, Bug,
  Lock, EyeOff, Key, LogOut, Check, X, CheckCircle
} from 'lucide-react';

const Step4 = () => {
  const accessData = [
    { icon: User, entity: 'You', canRead: true, reason: 'You have the seed phrase and keys', color: 'green' },
    { icon: Server, entity: 'Server', canRead: false, reason: 'Only stores encrypted data', color: 'red' },
    { icon: ShieldAlert, entity: 'Admin', canRead: false, reason: 'No access to decryption keys', color: 'red' },
    { icon: Bug, entity: 'Hackers', canRead: false, reason: 'Data is encrypted end-to-end', color: 'red' }
  ];

  const features = [
    { icon: Lock, title: 'End-to-End Encryption', desc: 'Data is encrypted on your device before transmission and decrypted only when you access it.', color: 'purple' },
    { icon: EyeOff, title: 'Zero-Knowledge', desc: 'Server never has access to your encryption keys or readable data - true privacy.', color: 'pink' },
    { icon: Key, title: 'You Control Keys', desc: 'Your seed phrase is the master key - only you have it, only you can access your data.', color: 'rose' },
    { icon: ShieldCheck, title: 'Breach Resistant', desc: 'Even if servers are compromised, your data remains secure and unreadable.', color: 'orange' }
  ];

  return (
    <div className="step-content">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
          Your Data is Secure
        </h2>
        <p className="text-slate-300 text-lg">Zero-knowledge encryption in action</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Statement */}
        <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 border-2 animate-gradient-border rounded-2xl p-8 text-center">
          <ShieldCheck className="w-20 h-20 text-purple-400 mx-auto mb-4 animate-pulse-custom" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Your data is encrypted before it leaves your device
          </h3>
          <p className="text-lg text-slate-300 mb-4">Only you hold the key</p>
          <div className="inline-flex items-center gap-2 bg-purple-500/20 px-6 py-3 rounded-full">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Zero-Knowledge Encryption</span>
          </div>
        </div>

        {/* Access Table */}
        <div className="bg-slate-900/50 rounded-xl p-8 border border-purple-500/10">
          <h3 className="text-xl font-bold text-white mb-6 text-center">Who Can Access Your Data?</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Entity</th>
                  <th className="text-center py-4 px-4 text-slate-400 font-medium">Can Read Data?</th>
                  <th className="text-left py-4 px-4 text-slate-400 font-medium">Why?</th>
                </tr>
              </thead>
              <tbody>
                {accessData.map((item, index) => (
                  <tr key={index} className="border-b border-slate-800 animate-slide-down" style={{ animationDelay: `${0.1 * index}s` }}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                        <span className="text-white font-medium">{item.entity}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-2 bg-${item.color}-500/20 text-${item.color}-400 px-4 py-2 rounded-full text-sm font-medium`}>
                        {item.canRead ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {item.canRead ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-400">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-900/50 rounded-xl p-6 border border-purple-500/10 animate-slide-right" style={{ animationDelay: `${0.2 * index}s` }}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 bg-${feature.color}-500/20 rounded-lg flex items-center justify-center`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
              </div>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Logout Info */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <LogOut className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">Logout = Total Lockdown</h3>
              <p className="text-sm text-red-200 mb-3">
                When you logout, all keys are removed from your device. To access your data again, you must log in with your seed phrase.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full">Access token cleared</span>
                <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full">Encryption key removed</span>
                <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full">Private key deleted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;