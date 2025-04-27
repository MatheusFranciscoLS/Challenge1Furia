import React from "react";

export default function SidebarQuizEnqueteButtons({ onQuiz, onEnquete }) {
  return (
    <div style={{display:'flex',flexDirection:'row',gap:16,margin:'16px 0 12px 0',justifyContent:'center',alignItems:'center'}}>
      <button
        type="button"
        className="furia-btn sidebar-quiz-btn"
        style={{
          background:'#FFD600',
          color:'#181A20',
          fontWeight:800,
          borderRadius:10,
          padding:'14px 0 10px 0',
          border:'2px solid #FFD600',
          fontSize:'1.1em',
          boxShadow:'0 2px 10px #FFD60033',
          width:'5px',
          minWidth:'100px',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          gap:2,
          transition:'background 0.18s, color 0.18s',
          cursor:'pointer',
        }}
        onClick={onQuiz}
        onMouseOver={e=>e.currentTarget.style.background='#ffe066'}
        onMouseOut={e=>e.currentTarget.style.background='#FFD600'}
      >
        <span style={{fontSize:'0,8em',marginBottom:1}}>🧠</span>
        <span style={{fontSize:'0.8em',fontWeight:700,letterSpacing:0.1}}>Quiz</span>
      </button>
      <button
        type="button"
        className="furia-btn sidebar-enquete-btn"
        style={{
          background:'#FFD600',
          color:'#181A20',
          fontWeight:800,
          borderRadius:10,
          padding:'14px 0 10px 0',
          border:'2px solid #FFD600',
          fontSize:'1.1em',
          boxShadow:'0 2px 10px #FFD60033',
          width:'5px',
          minWidth:'100px',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          gap:2,
          transition:'background 0.18s, color 0.18s',
          cursor:'pointer',
        }}
        onClick={onEnquete}
        onMouseOver={e=>e.currentTarget.style.background='#ffe066'}
        onMouseOut={e=>e.currentTarget.style.background='#FFD600'}
      >
        <span style={{fontSize:'0.8em',marginBottom:1}}>📊</span>
        <span style={{fontSize:'0.8em',fontWeight:700,letterSpacing:0.1}}>Enquete</span>
      </button>
    </div>
  );
}
