"use client";
import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Search, Sparkles, Camera, Shield, Trash2, LogOut, User as UserIcon, Infinity, MapPin, Tag, Menu } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const [view, setView] = useState("feed");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  
  // Admin State
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Upload State
  const [form, setForm] = useState({ name: "", bio: "", location: "", dob: "" });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => { runSearch(""); }, []);

  // --- ACTIONS ---
  const runSearch = async (q) => {
    try {
        const res = await fetch("/api/search", { method: "POST", body: JSON.stringify({ query: q }) });
        const data = await res.json();
        setUsers(data.users || []);
    } catch (e) { console.error(e); }
  };

  const deleteUser = async (id) => {
    if(!confirm("Delete this user?")) return;
    const res = await fetch("/api/admin", {
        method: "POST",
        body: JSON.stringify({ action: "delete", id, password: adminPass })
    });
    if(res.ok) runSearch("");
  };

  const handleAdminLogin = async () => {
    const res = await fetch("/api/admin", { method: "POST", body: JSON.stringify({ action: "stats", password: adminPass }) });
    const data = await res.json();
    if (data.success) setIsAdminLoggedIn(true);
    else alert("Wrong Password");
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    if (!image) return alert("Upload a photo!");
    setStatus("AI Analyzing: Identifying Aesthetic & Vibe...");
    
    const res = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({ ...form, email: session.user.email, imageBase64: image }),
    });
    
    const data = await res.json();
    if (data.success) {
      setStatus("✨ Aesthetic Analyzed!");
      setTimeout(() => { setView("feed"); runSearch(""); }, 2000);
    } else {
      setStatus("Error: " + data.error);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- COMPONENTS ---
  const AdsterraAd = ({ adKey, width, height }) => {
    const bannerRef = useRef(null);

    useEffect(() => {
      // Clear out the div if it already has something so it doesn't duplicate
      if (bannerRef.current) {
        bannerRef.current.innerHTML = ''; 
        
        const conf = document.createElement("script");
        conf.type = "text/javascript";
        conf.innerHTML = `
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        `;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;

        bannerRef.current.append(conf);
        bannerRef.current.append(script);
      }
    }, [adKey, width, height]);

    return (
      <div className="flex justify-center my-6 w-full">
        {/* The container dynamically sizes itself to fit the ad perfectly */}
        <div 
            ref={bannerRef} 
            className="flex items-center justify-center overflow-hidden"
            style={{ width: `${width}px`, minHeight: `${height}px` }}
        >
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500 selection:text-white pb-24 md:pb-0">
      
      {/* --- DESKTOP NAVBAR --- */}
      <nav className="hidden md:block fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("feed")}>
            <Infinity className="text-indigo-500 w-10 h-10 md:w-12 md:h-12" strokeWidth={3} />
             <h1 className="text-3xl font-black tracking-tighter">ANURUPA</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-neutral-400 hover:text-white text-sm font-bold transition mr-2">About</Link>
            {session ? (
               <div className="flex items-center gap-3">
                 {session.user.image && <img src={session.user.image} className="w-8 h-8 rounded-full border border-indigo-500" />}
                 <button onClick={() => setView("upload")} className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold transition">+ Join</button>
                 <button onClick={() => signOut()} className="text-neutral-400 hover:text-white"><LogOut size={18}/></button>
               </div>
            ) : (
               <button onClick={() => signIn("google")} className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">Login</button>
            )}
            <button onClick={() => setShowAdmin(!showAdmin)} className="text-neutral-600 hover:text-red-500 transition ml-2"><Shield size={16} /></button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE TOP BAR --- */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-black/90 backdrop-blur border-b border-white/10 px-4 h-14 flex justify-between items-center">
          <div className="flex items-center gap-2" onClick={() => setView("feed")}>
             <Infinity className="text-indigo-500 w-5 h-5" />
             <h1 className="text-lg font-black tracking-tighter">ANURUPA</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAdmin(!showAdmin)} className="text-neutral-600"><Shield size={16} /></button>
            <Link href="/about" className="text-neutral-400 text-xs font-bold">About</Link>
          </div>
      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="md:hidden fixed bottom-0 w-full z-50 bg-black border-t border-white/10 pb-safe pt-2 px-6 flex justify-between items-center h-16 safe-area-bottom">
          <button onClick={() => setView("feed")} className={`flex flex-col items-center gap-1 ${view === 'feed' ? 'text-indigo-500' : 'text-neutral-500'}`}>
              <Search size={24} strokeWidth={view === 'feed' ? 3 : 2} />
              <span className="text-[10px] font-medium">Explore</span>
          </button>
          <button onClick={() => setView("upload")} className={`flex flex-col items-center gap-1 ${view === 'upload' ? 'text-indigo-500' : 'text-neutral-500'}`}>
              <Camera size={24} strokeWidth={view === 'upload' ? 3 : 2} />
              <span className="text-[10px] font-medium">Create</span>
          </button>
          <button onClick={() => session ? signOut() : signIn("google")} className="flex flex-col items-center gap-1 text-neutral-500">
              {session?.user?.image ? <img src={session.user.image} className="w-6 h-6 rounded-full border border-neutral-500" /> : <UserIcon size={24} />}
              <span className="text-[10px] font-medium">{session ? "Logout" : "Login"}</span>
          </button>
      </div>

      {/* Admin Modal */}
      {showAdmin && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-700 p-6 rounded-3xl w-full max-w-sm relative">
                <button onClick={() => setShowAdmin(false)} className="absolute top-4 right-4 text-neutral-500">✕</button>
                <h2 className="text-xl font-bold text-red-500 mb-4">Admin Access</h2>
                {!isAdminLoggedIn ? (
                    <div className="space-y-4">
                        <input type="password" placeholder="Password" className="w-full p-3 bg-black rounded-xl border border-neutral-700 text-white" 
                            onChange={(e) => setAdminPass(e.target.value)} />
                        <button onClick={handleAdminLogin} className="w-full bg-red-600 py-2 rounded-xl font-bold">Login</button>
                    </div>
                ) : (
                    <div className="text-center text-green-500">Access Granted. Delete buttons active.</div>
                )}
            </div>
        </div>
      )}

      {/* Main Layout */}
      <main className="pt-20 md:pt-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN - Filters */}
        <div className="hidden lg:block space-y-6">
            <div className="sticky top-24 space-y-6">
                <div className="bg-neutral-900 rounded-3xl p-6 border border-white/5">
                    <h3 className="font-bold text-lg mb-4 text-neutral-200">Find Your Match</h3>
                    <div className="relative">
                        <input className="w-full bg-black border border-neutral-800 p-3 pl-10 rounded-xl outline-none focus:border-indigo-500 text-sm" 
                            placeholder="e.g. 'Minimalist in NYC'" 
                            value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && runSearch(search)} />
                        <Search className="absolute left-3 top-3.5 text-neutral-600" size={16} />
                    </div>
                </div>
                <AdsterraAd />
            </div>
        </div>

        {/* CENTER COLUMN - Content */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Mobile Search */}
            {view === 'feed' && (
                <div className="lg:hidden sticky top-16 z-30 mb-4">
                    <div className="relative shadow-xl">
                        <input className="w-full bg-neutral-900/90 backdrop-blur border border-white/10 p-3 pl-10 rounded-2xl outline-none text-white text-sm" 
                            placeholder="Find aesthetic (e.g. 'Goth', 'Vintage')..." 
                            value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && runSearch(search)} />
                        <Search className="absolute left-3 top-3.5 text-indigo-500" size={18} />
                    </div>
                </div>
            )}

            {view === "upload" ? (
                <div className="bg-neutral-900 rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
                     {!session ? (
                        <div className="text-center py-12 space-y-4">
                            <h2 className="text-xl font-bold">Login Required</h2>
                            <button onClick={() => signIn("google")} className="bg-white text-black px-8 py-3 rounded-full font-bold">Login with Google</button>
                        </div>
                    ) : (
                        <form onSubmit={submitProfile} className="space-y-6">
                            <div className="text-center pb-4 border-b border-white/5">
                                <h2 className="text-xl font-bold">Create Profile</h2>
                                <p className="text-neutral-500 text-xs mt-1">AI will analyze your Aesthetic & Vibe</p>
                            </div>
                            <div className="flex justify-center">
                                <label className="relative w-full aspect-[3/4] max-w-[200px] bg-black rounded-2xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center cursor-pointer">
                                    {image ? <img src={image} className="absolute inset-0 w-full h-full object-cover rounded-xl" /> : <Camera size={24} className="text-neutral-500"/>}
                                    <input type="file" className="hidden" onChange={handleImage} accept="image/*" />
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="w-full p-3 bg-black rounded-xl border border-neutral-800 text-sm" required />
                                <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full p-3 bg-black rounded-xl border border-neutral-800 text-neutral-300 text-sm" required />
                            </div>
                            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Location" className="w-full p-3 bg-black rounded-xl border border-neutral-800 text-sm" required />
                            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Bio..." className="w-full p-3 bg-black rounded-xl border border-neutral-800 min-h-[80px] text-sm" required />
                            <button type="submit" disabled={status.includes("AI Analyzing")} className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50">
                                {status || "Analyze & Launch"}
                            </button>
                        </form>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {users.length === 0 && <div className="text-center py-20 text-neutral-600 text-sm"><p>No profiles found. Search or create one!</p></div>}
                    {users.map(u => (
                        <div key={u._id} className="bg-neutral-900 rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative">
                            {isAdminLoggedIn && <button onClick={() => deleteUser(u._id)} className="absolute top-4 left-4 z-30 bg-red-600 text-white p-2 rounded-full"><Trash2 size={16} /></button>}
                            
                            {/* Image Section */}
                            <div className="aspect-[4/5] relative">
                                <img src={u.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-90"></div>
                                
                                {/* Overlay Info */}
                                <div className="absolute bottom-0 w-full p-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <h3 className="text-3xl font-black text-white">{u.name}, {u.age}</h3>
                                            <div className="flex items-center gap-2 text-neutral-300 text-sm mt-1">
                                                <MapPin size={14} /> {u.location}
                                            </div>
                                        </div>
                                        {/* AI Aesthetic Badge */}
                                        {u.aesthetic && (
                                            <div className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                                                {u.aesthetic}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Details Section (The "Anurupa" Data) */}
                            <div className="p-6 pt-4 space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {/* Vibe Tag */}
                                    {u.vibe && (
                                        <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-indigo-300">
                                            <Sparkles size={12} /> Vibe: {u.vibe}
                                        </span>
                                    )}
                                    {/* Fashion Tags */}
                                    {u.fashionTags && u.fashionTags.map((tag, i) => (
                                        <span key={i} className="flex items-center gap-1 bg-black border border-white/10 px-2 py-1 rounded text-[10px] text-neutral-400">
                                            <Tag size={10} /> {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-neutral-400 leading-relaxed">{u.bio}</p>
                                <p className="text-[12px] text-neutral-300 mt-2">Joined {new Date(u.createdAt).toLocaleDateString(undefined, {month: "long", year: "numeric",})}</p>
                            </div>
                        </div>
                    ))}
                    
                    {/* Mobile Feed Ad */}
                    <div className="lg:hidden"><AdsterraAd /></div>
                </div>
            )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="hidden lg:block space-y-6">
            <div className="sticky top-24 space-y-6">
                <AdsterraAd />
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center">
                    <h4 className="font-bold text-lg mb-2">Join Anurupa</h4>
                    <p className="text-neutral-500 text-sm mb-4">Discover your aesthetic match.</p>
                    <button onClick={() => setView("upload")} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-bold transition">Get Analyzed</button>
                </div>
                <AdsterraAd />
            </div>
        </div>
      </main>
    </div>
  );
}