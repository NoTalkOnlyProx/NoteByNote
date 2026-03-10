import ChallengeB from './ChallengeB.svelte';
import '../global.css';

import { mount } from 'svelte';

const app = mount(ChallengeB, {target: document.getElementById('root') as Element});
//
export default app;
