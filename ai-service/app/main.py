from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import pandas as pd
import numpy as np
from datetime import datetime
import asyncpg
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Personal Finance AI Service",
    description="AI-powered financial insights and predictions",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://dhairyakandhari@localhost:5432/finance_tracker")

async def get_user_transactions(user_id: str):
    """Fetch user transactions from database"""
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        
        # Updated query to match your exact database structure
        query = """
            SELECT id, amount, category, date, description, created_at
            FROM transactions 
            WHERE user_id = $1
            ORDER BY date DESC
        """
        
        print(f"Querying transactions for user_id: {user_id}")
        rows = await conn.fetch(query, user_id)
        await conn.close()
        
        print(f"Found {len(rows)} transactions")
        
        # Convert to list of dicts
        transactions = []
        for row in rows:
            transactions.append({
                'id': row['id'],
                'amount': float(row['amount']),
                'category': row['category'],
                'date': row['date'].isoformat() if row['date'] else None,
                'description': row['description'] or '',
                'created_at': row['created_at'].isoformat() if row['created_at'] else None
            })
        
        print(f"Processed transactions: {transactions}")
        return transactions
        
    except Exception as e:
        print(f"Database error: {e}")
        return []

@app.get("/")
async def root():
    return {"message": "Personal Finance AI Service", "version": "2.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service"}

@app.get("/api/ai/insights/{user_id}")
async def get_insights(user_id: str):
    """Get AI insights for user spending"""
    try:
        print(f"Getting insights for user: {user_id}")
        transactions = await get_user_transactions(user_id)
        
        if not transactions:
            return {
                "insights": [
                    {
                        "type": "info",
                        "title": "No Data",
                        "message": "No transactions found for analysis",
                        "details": "Add some transactions to get AI insights"
                    }
                ],
                "message": "No transaction data available"
            }
        
        # Convert to DataFrame for analysis
        df = pd.DataFrame(transactions)
        df['amount'] = pd.to_numeric(df['amount'])
        
        insights = []
        
        # Total spending analysis
        total_spending = df['amount'].sum()
        avg_transaction = df['amount'].mean()
        transaction_count = len(df)
        
        insights.append({
            "type": "summary",
            "title": "Spending Summary",
            "message": f"You've spent ${total_spending:.2f} across {transaction_count} transactions",
            "details": f"Average transaction: ${avg_transaction:.2f}"
        })
        
        # Category analysis
        if 'category' in df.columns:
            category_spending = df.groupby('category')['amount'].agg(['sum', 'count'])
            if not category_spending.empty:
                top_category = category_spending['sum'].idxmax()
                top_amount = category_spending['sum'].max()
                
                insights.append({
                    "type": "category",
                    "title": "Top Spending Category",
                    "message": f"You spend the most on {top_category}",
                    "details": f"${top_amount:.2f} total in this category"
                })
                
                # Recommendation
                savings_potential = top_amount * 0.15
                insights.append({
                    "type": "recommendation",
                    "title": "Smart Saving Tip",
                    "message": f"Try to reduce {top_category} spending by 15%",
                    "details": f"This could save you ${savings_potential:.2f}"
                })
        
        # Spending pattern
        if total_spending > 500:
            insights.append({
                "type": "trend",
                "title": "High Spending Alert",
                "message": "Your total spending is quite high",
                "details": f"Consider reviewing expenses over ${avg_transaction:.2f}"
            })
        elif total_spending > 100:
            insights.append({
                "type": "trend",
                "title": "Moderate Spending",
                "message": "Your spending levels look reasonable",
                "details": "Keep tracking to maintain good habits"
            })
        
        return {
            "insights": insights,
            "transaction_count": transaction_count,
            "total_spending": float(total_spending),
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error generating insights: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

@app.get("/api/ai/prediction/{user_id}")
async def get_prediction(user_id: str):
    """Get spending predictions"""
    try:
        print(f"Getting prediction for user: {user_id}")
        transactions = await get_user_transactions(user_id)
        
        if len(transactions) < 3:
            return {
                "message": "Need more transactions for predictions",
                "prediction": {
                    "next_month": 0,
                    "confidence": "low",
                    "daily_average": 0
                }
            }
        
        df = pd.DataFrame(transactions)
        df['amount'] = pd.to_numeric(df['amount'])
        
        # Calculate predictions
        total_amount = df['amount'].sum()
        avg_transaction = df['amount'].mean()
        transaction_count = len(df)
        
        # Simple daily average (assuming transactions span multiple days)
        daily_average = avg_transaction
        
        # Next month prediction (average transaction * estimated monthly transactions)
        estimated_monthly_transactions = max(10, transaction_count * 2)  # Rough estimate
        next_month_prediction = avg_transaction * estimated_monthly_transactions
        
        # Confidence based on data amount
        if transaction_count >= 10:
            confidence = "high"
        elif transaction_count >= 5:
            confidence = "medium"
        else:
            confidence = "low"
        
        return {
            "prediction": {
                "next_month": round(next_month_prediction, 2),
                "daily_average": round(daily_average, 2),
                "confidence": confidence
            },
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Error generating prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate prediction: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )