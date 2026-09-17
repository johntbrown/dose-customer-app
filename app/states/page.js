import StateShowcase from '../components/StateShowcase';

export const metadata={title:'My Dose · State QA'};

export default function StatesPage(){
  return <main className="appShell"><header className="appHeader"><a className="logo" href="/">Dose</a><span className="demoPill">State QA</span><a className="avatar" href="/">J</a></header><StateShowcase/></main>;
}
