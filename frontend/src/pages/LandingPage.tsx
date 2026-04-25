import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Leaf, Map, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative">
      
      {/* Clean Navbar */}
      <nav className="w-full z-50 py-4 sm:py-6 absolute top-0 left-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-[#a3e635] p-2.5 rounded-xl shadow-sm">
              <Leaf className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-md">SmartSeason</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/login?role=admin">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20 font-semibold px-3 sm:px-4 text-xs sm:text-sm rounded-full transition-all">
                <span className="hidden sm:inline mr-1">Login as </span>Admin
              </Button>
            </Link>
            <Link to="/login?role=agent">
              <Button className="bg-[#a3e635] hover:bg-[#84cc16] text-gray-900 font-bold px-4 sm:px-6 text-xs sm:text-sm rounded-full shadow-sm transition-all">
                <span className="hidden sm:inline mr-1">Login as </span>Agent
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] shrink-0 pt-40 pb-20">
        {/* Crisp Image with simple dark overlay for clear visibility */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero.png')" }}
        ></div>
        <div className="absolute inset-0 z-0 bg-black/40 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-4 sm:mb-6 drop-shadow-md">
              Smart Field Monitoring for <br className="hidden md:block" />
              <span className="text-[#a3e635] drop-shadow-none">Better Decisions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
              Track field progress, monitor updates, and manage farming operations with absolute clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="bg-[#a3e635] hover:bg-[#84cc16] text-gray-900 font-bold rounded-full px-8 py-6 w-full sm:w-auto text-lg hover:-translate-y-0.5 transition-all">
                  Join as an Agent
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Secondary Section (Value Props) */}
      <section className="py-20 bg-white z-10 relative">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-gray-500 mt-3 text-base max-w-2xl mx-auto font-medium">Powerful tools built seamlessly into one platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white shadow-xl shadow-gray-200/40 border-2 border-[#a3e635] hover:-translate-y-1 transition-transform duration-300 group"
            >
              <div className="p-4 bg-[#a3e635]/10 rounded-2xl mb-5 text-[#84cc16] group-hover:bg-[#a3e635] group-hover:text-gray-900 transition-colors">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Field Tracking</h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                Monitor crop health and growth cycles with precision mapping and historical data.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white shadow-xl shadow-gray-200/40 border-2 border-[#a3e635] hover:-translate-y-1 transition-transform duration-300 group"
            >
              <div className="p-4 bg-[#a3e635]/10 rounded-2xl mb-5 text-[#84cc16] group-hover:bg-[#a3e635] group-hover:text-gray-900 transition-colors">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Agent Updates</h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                Stay connected with real-time field reports and instant sync from your on-ground team.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white shadow-xl shadow-gray-200/40 border-2 border-[#a3e635] hover:-translate-y-1 transition-transform duration-300 group"
            >
              <div className="p-4 bg-[#a3e635]/10 rounded-2xl mb-5 text-[#84cc16] group-hover:bg-[#a3e635] group-hover:text-gray-900 transition-colors">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Real-time Monitoring</h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                Make proactive decisions using live environmental data and automated alerts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Image CTA Banner */}
      <section className="py-12 bg-white pb-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] flex items-center justify-center group border border-gray-200">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
              style={{ backgroundImage: "url('/images/feature1.jpg')" }}
            ></div>
            {/* Simple dark overlay to make text pop without hiding the image */}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 text-center text-white px-6">
               <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-md">Ready to Scale Your Farming?</h2>
               <p className="text-base md:text-lg font-medium text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
                 Join the growing network of modern farmers and agents leveraging our tools to drive better operational results.
               </p>
               <div className="flex justify-center">
                 <Link to="/register">
                   <Button className="bg-[#a3e635] hover:bg-[#84cc16] text-gray-900 font-bold px-8 py-6 rounded-full text-base shadow-lg shadow-[#a3e635]/20 hover:-translate-y-0.5 transition-all">
                     Create Free Account
                   </Button>
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-center items-center gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#84cc16]" />
            <span className="text-lg font-bold tracking-tight text-gray-900">SmartSeason</span>
          </div>
          <p className="text-gray-400 font-medium text-xs text-center">
            © 2026 SmartSeason Technologies. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
};
