import React from 'react';
import '../styles/wallet.css'; // <-- Make sure you create & import this file

export default function Wallet({ wallet }) {
  return (
    <>
      <h2 className="wallet-page-title">Wallet & Payments</h2>

      <div className="wallet-page-layout">
        
        {/* LEFT SIDE */}
        <div>

          {/* WALLET BALANCE CARD */}
          <div className="wallet-page-balance-card">
            <div className="wallet-page-balance-top">
              <div>
                <div className="wallet-page-balance-label">Available Balance</div>
                <div className="wallet-page-balance-value">₹{wallet.balance}</div>
              </div>
              <div className="wallet-page-balance-icon">
                <i className="fas fa-wallet"></i>
              </div>
            </div>

           
          </div>

          {/* TRANSACTIONS */}
          <div className="wallet-page-card">
            <h3 className="wallet-page-section-title">Recent Transactions</h3>

            <div className="wallet-page-transactions-list">
              {wallet.transactions.map(tx => (
                <div className="wallet-page-transaction-item" key={tx.id}>
                  
                  <div className="wallet-page-transaction-info">
                    <div className={`wallet-page-transaction-icon ${tx.type}`}>
                      <i className={tx.type === 'credit' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'}></i>
                    </div>

                    <div>
                      <div className="wallet-page-transaction-title">{tx.title}</div>
                      <div className="wallet-page-transaction-date">{tx.date}</div>
                    </div>
                  </div>

                  <div className={`wallet-page-transaction-amount ${tx.type}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div>

          <div className="wallet-page-card">
            <h3 className="wallet-page-section-title">Payment Methods</h3>

            <div className="wallet-page-cards-list">
              {wallet.cards.map(c => (
                <div className={`wallet-page-card-item ${c.primary ? 'primary' : ''}`} key={c.id}>
                  <div className="wallet-page-card-icon">
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <div>
                    <div className="wallet-page-card-number">{c.masked}</div>
                    <div className="wallet-page-card-type">{c.primary ? 'Primary Card' : 'Backup Card'}</div>
                  </div>
                </div>
              ))}

              <button className="wallet-page-add-card-btn">
                <i className="fas fa-plus"></i> Add New Card
              </button>

            </div>
          </div>

        </div>

      </div>
    </>
  );
}
