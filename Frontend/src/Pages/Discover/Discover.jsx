import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "react-bootstrap/Spinner";
import ProfileCard from "./ProfileCard";
import { FiSearch, FiFilter, FiUser, FiCode, FiCpu, FiPlusCircle } from "react-icons/fi";

const Discover = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Perfect Matches");
  const [searchQuery, setSearchQuery] = useState("");

  const [users, setUsers] = useState({
    perfectMatches: [],
    recommended: [],
    webDev: [],
    ml: [],
    others: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: userData } = await axios.get(`/user/registered/getDetails`);
        if (userData && userData.data) {
          setUser(userData.data);
          localStorage.setItem("userInfo", JSON.stringify(userData.data));
        }

        const { data: discoverData } = await axios.get("/user/discover");
        setUsers({
          perfectMatches: discoverData.data.perfectMatches || [],
          recommended: discoverData.data.forYou || [],
          webDev: discoverData.data.webDev || [],
          ml: discoverData.data.ml || [],
          others: discoverData.data.others || []
        });
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: "Perfect Matches", icon: <FiFilter />, key: "perfectMatches" },
    { name: "Recommended", icon: <FiUser />, key: "recommended" },
    { name: "Web Development", icon: <FiCode />, key: "webDev" },
    { name: "AI & ML", icon: <FiCpu />, key: "ml" },
    { name: "Others", icon: <FiPlusCircle />, key: "others" },
  ];

  const getActiveUsers = () => {
    const key = categories.find(c => c.name === activeCategory)?.key || "recommended";
    const userList = users[key];
    if (!searchQuery) return userList;
    return userList.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.skillsProficientAt.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', paddingTop: '100px' }}>
      {/* Categories Sidebar */}
      <aside style={{
        width: '300px',
        height: 'calc(100vh - 100px)',
        position: 'fixed',
        left: '5%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <h4 style={{ marginBottom: '20px', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Explore Skills
        </h4>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className="glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              padding: '15px 20px',
              border: activeCategory === cat.name ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
              background: activeCategory === cat.name ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              color: activeCategory === cat.name ? 'var(--primary)' : 'var(--text-main)',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'var(--transition-smooth)',
              width: '100%'
            }}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '400px', flex: 1, paddingRight: '5%' }}>
        {/* Search & Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          background: 'rgba(255,255,255,0.02)',
          padding: '20px',
          borderRadius: '24px',
          border: '1px solid var(--border-glass)'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{activeCategory}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Find your perfect skill swap partner today.</p>
          </div>
          <div className="glass" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 20px',
            gap: '15px',
            width: '400px'
          }}>
            <FiSearch style={{ color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search skills or names..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', height: '50vh', alignItems: 'center' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '30px',
            paddingBottom: '60px'
          }}>
            <AnimatePresence mode="popLayout">
              {getActiveUsers().length > 0 ? (
                getActiveUsers().map((u, i) => (
                  <motion.div
                    key={u._id || i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProfileCard 
                      profileImageUrl={u.picture}
                      name={u.name}
                      rating={u.rating || 5}
                      bio={u.bio}
                      skills={u.skillsProficientAt}
                      username={u.username}
                    />
                  </motion.div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px' }}>
                  <h2 style={{ color: 'var(--text-muted)' }}>No experts found for this match.</h2>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Discover;
