# NoteByNote

This is a simplistic (read: extremely hacky) ear trainer I put together mostly for my own purposes.

### [Try it yourself here](https://notalkonlyprox.github.io/NoteByNote/challenge_b.html)

### Overview
If you're here looking for good code, go away.
Everything here is motivated by getting it done with the least amount of effort possible.

If you're looking for something based on standard music theory, I'm sorry.
I have very strange beliefs about standard music theory.
That is why I have created my own ear trainer, after all.
No existing ear trainer that I know of serves my specific needs.

Here is a broad description of this ear trainer:

### Challenge Type B (The only type I implemented):
- You may request a new challenge by clicking `New Everything`.
- This will pick a random chord, either based on traditional music theory, or using a custom-made heuristic.
- This chord will play, and it is your job to figure out which notes on the piano roll you must press to reproduce this chord.
- You can select the number of notes that should be in the challenge chord.
  - In fact, you MUST do this, because the number currently starts out undefined (whoops).
- The piano you are using uses a DIFFERENT soundfont than the instrument 


### Motivations
I created this ear trainer to help me with a specific weakness I have.

As a learning musician, I often engage in the "reverse engineering" (normal musicians call this transcription) of music I like.
I do this in the hopes that it will teach me something about what I like about the music I like. It often does.

But my biggest struggle is with transcribing chords, especially when I don't have an instrument on hand that is a decent match for whatever software instrument was used by the musician in question.

That is what this trainer is for.
It is to help me learn to recreate the chords that artists I like use in my recreations of their work.
I specifically programmed the challenge soundfont to be (most of the time) different from the user soundfont, in order to help me confront the ambiguities I often encounter when attempting to transcribe an instrument I cannot fully create.

Additionally, for personal reasons, I am keen to avoid any kind of reliance on standard music theory. 

To explain this better, consider the traditional approach to transcription:
One usually learns what all of the most common standard chords (and their various expressions) sound like "as a whole", and then memorize the note placements require to achieve such a chord.

Someone using this method could theoretically ***just hear*** a `major diminished 7th chord` with root `E`, and then simply know, by rote memorization, the required note placements to produce such a chord.

But as I said, I am not interested in this method -- not yet, anyways. I think it will be useful eventually, especially for communicating with other musicians.
But, at the moment, and foolish though it may be, I want to try to do things another way first.

I want to instead learn to literally hear the individual notes in chords that are played (or at least learn how to extract them using the tools this trainer provides).
This way, I need never actually memorize chord names. Instead, I am forced to understand how intervals just sound.

I cannot force you to use this tool this way, but that is the reason you will find no note names, no chord names, no music theory whatsoever in this trainer.
The goal is solely to "find the notes" required to reproduce a sound.

Another quirk. I randomly detune the piano between each challenge by a non-integer amount, so do NOT expect A0 to be 440hz... basically ever.

### Implications
I find it interesting that some instruments, due to having simpler harmonics, can be played in a chord such that this chord sounds sonant with / very similar to a single note of another instrument with more complex harmonics.

From a mathematical perspective, this makes sense -- there is no difference, spectrally, between a single note of a  complex sound, and a complex chord chord composed of the appropriately detuned pure sin waves.
Except, of course, the matter of phase correlation, but that is less important for a single instrument.

So it remains a mystery to me just how our brains decide "ah, yes, this set of harmonics I am hearing is two notes of a single harmonic profile" vs. "no, this is just a single note of a more rich harmonic profile".

The fact that I am sometimes tricked, when attempting to transcribe / reverse engineer chords made from complex sounds into instruments using simple sounds suggests strongly that there is even some degree to which the human brain ***cannot*** decide whether it is hearing a single complex note, or many simple ones.

I think understanding the specific situations in which I (or you) find myself (or yourself) tricked may lead to a better understanding of how the human mind processes notes as a whole.
I don't mean scientifically of course, I just mean, you (or I), might just glean some insight which could be useful when producing music.

For instance, I specifically think it would be extremely interesting to create music which specifically plays with this kind of false-equivalence.

Imagine a song which starts out playing fixed chords of pure sin waves in some kind of high-note-count tuning, such that the fixed chords played are at traditional 12EDO intervals, but the individual sine waves are played at microtonal intervals which are close to the intervals which occur in the actual harmonics of, say, a sawtooth.

You could then slowly deviate from the fixed chord, and mess with your listener by attempting to confuse them -- was it really a single instrument they heard at first at all?
Was it even a 12EDO song they were listening to?

This is the kind of strange music I think exploring hte boundaries between overtone and harmony can expose.
And this is why I want to develop my ear in such a way that these boundaries are maximally explored, without reliance on the usual mnemonics / namings invented by traditional theory. 

### Why is this open source

Entirely out of laziness. Github sites is a super easy way for me to make this available to myself on my various devices without using Webstorm.

Well, mostly. Some people are curious about this bizzare training method of mine, and want to try it out, so this also allows them to do that.


