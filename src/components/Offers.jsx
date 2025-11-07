import React from 'react';

export default function Offers({ offers }) {
  return (
    <>
      <h2 className="section-title">Available Offers</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:16}}>
        {offers.map(o => (
          <div className="card" key={o.id} style={{borderLeft:'4px solid #ef4444'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:8}}>
              <div style={{width:60,height:60,background:'#fff0f0',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,color:'#ef4444'}}>
                <i className="fas fa-percent"></i>
              </div>
              <span className="badge green">{o.active ? 'Active' : 'Expired'}</span>
            </div>

            <h3 style={{fontSize:18,fontWeight:700,color:'#111827',marginBottom:4}}>{o.title}</h3>
            <p style={{color:'#6b7280',marginBottom:12}}>{o.desc}</p>

            <div style={{background:'#f3f4f6',border:'2px dashed #e5e7eb',borderRadius:8,padding:8,textAlign:'center',marginBottom:12}}>
              <div style={{fontFamily:'monospace',fontWeight:700,color:'#ef4444'}}>{o.code}</div>
            </div>

            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#6b7280',marginBottom:12}}>
              <span>Min: ₹{o.min}</span>
              <span>Expires: {o.expires}</span>
            </div>

            <button className="btn btn-primary" style={{width:'100%'}}>Apply Offer</button>
          </div>
        ))}
      </div>
    </>
  );
}
