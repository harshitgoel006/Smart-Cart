import { Link } from 'react-router-dom'
export function SimpleAccountPage({ title, text, link, linkText }: { title: string; text: string; link: string; linkText: string }) { return <main className="section empty-page"><span className="eyebrow">SmartCart</span><h1>{title}</h1><p>{text}</p><Link className="primary-button" to={link}>{linkText} <span>↗</span></Link></main> }
