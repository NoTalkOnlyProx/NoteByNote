import ChallengeB from './ChallengeB.svelte';
import '../global.css';

const app = new ChallengeB({
    target: document.getElementById('root') as HTMLElement, // entry point in ../public/index.html
});
//
export default app;
