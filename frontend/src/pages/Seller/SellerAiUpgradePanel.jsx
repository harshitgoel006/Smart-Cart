import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { sendJson } from '../../services/apiClient';

export function SellerAiUpgradePanel({ products = [] }) {
  const [productId, setProductId] = useState(products[0]?._id || ''); const [type, setType] = useState('forecast'); const [result, setResult] = useState(''); const [busy, setBusy] = useState(false);
  const selected = products.find((product) => product._id === productId);
  const generate = async () => { if (!selected) return; setBusy(true); try { const data = await sendJson('/ai/seller/content', 'POST', { type, name: selected.name, brand: selected.brand, category: selected.category?.name, description: selected.description, price: selected.price, stock: selected.stock }); setResult(data.content || 'No result'); } catch (error) { setResult(error.message); } finally { setBusy(false); } };
  return <section className="seller-card seller-ai-upgrade"><div className="seller-card__heading"><div><span className="eyebrow"><Sparkles size={14} /> AI operations</span><h2>Forecast & reorder assistant</h2></div></div><div className="seller-ai-controls"><select value={productId} onChange={(event) => setProductId(event.target.value)}><option value="">Choose a product</option>{products.map((product) => <option value={product._id} key={product._id}>{product.name}</option>)}</select><select value={type} onChange={(event) => setType(event.target.value)}><option value="forecast">Demand forecast</option><option value="reorder">Reorder suggestion</option></select><button className="primary-button" type="button" disabled={busy || !selected} onClick={generate}>{busy ? 'Thinking...' : 'Generate'}</button></div>{result && <pre className="seller-ai-result">{result}</pre>}</section>;
}
