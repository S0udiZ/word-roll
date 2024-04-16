<script lang="ts">
// biome-ignore lint/style/useConst: <explanation>
let string = "january";
let output: string[][] = [];
const sides = 8;

async function word_roll() {
	const word_length = string.length;
	const word_roll_array = [string];
	for (let i = 1; i < sides; i++) {
		let word_roll = "";
		for (let j = 0; j < word_length; j++) {
			// create a random letter
			const random_letter = String.fromCharCode(
				Math.floor(Math.random() * 26) + 97,
			);
			// add the random letter to the word
			word_roll += random_letter;
		}
		word_roll_array.push(word_roll);
	}
	output = await scramble(word_roll_array.map((word) => word.split("")));
}

function next(i: number) {
	const word_roll_col: string[] = [];
	for (let j = 0; j < sides; j++) {
		word_roll_col.push(output[j][i]);
	}
	const new_word_roll_col = word_roll_col.slice(1).concat(word_roll_col[0]);
	for (let j = 0; j < sides; j++) {
		output[j][i] = new_word_roll_col[j];
	}
}

function prev(i: number) {
	const word_roll_col: string[] = [];
	for (let j = 0; j < sides; j++) {
		word_roll_col.push(output[j][i]);
	}
	const new_word_roll_col = word_roll_col
		.slice(-1)
		.concat(word_roll_col.slice(0, -1));
	for (let j = 0; j < sides; j++) {
		output[j][i] = new_word_roll_col[j];
	}
}

async function scramble(y: string[][]) {
const promise: Promise<string[][]> = new Promise((resolve, reject) => {
  try {
    const comb_word_roll_col: string[][] = [];
    for (let i = 0; i < string.length; i++) {
      const word_roll_col: string[] = [];
      for (let j = 0; j < sides; j++) {
        word_roll_col.push(y[j][i]);
      }
      const rand = Math.floor(Math.random() * sides);
      const new_word_roll_col = word_roll_col
        .slice(rand)
        .concat(word_roll_col.slice(0, rand));
      comb_word_roll_col.push(new_word_roll_col);
    }
    const z: string[][] = [];
    // transpose the matrix
    for (let i = 0; i < sides; i++) {
      z.push([]);
    }
    for (let i = 0; i < string.length; i++) {
      for (let j = 0; j < sides; j++) {
        z[j].push(comb_word_roll_col[i][j]);
      }
    }
    resolve(z);
  } catch (error) {
    reject(error);
  }
});
return await promise;
}
</script>

<main class="">
  <form on:submit|preventDefault={word_roll} class="mx-auto w-fit flex gap-4">
    <label for="" class="flex flex-col text-xl font-bold w-fit"
      >Input word:
      <div
        class="flex border-2 border-black rounded-r-full divide-x-2 divide-black"
      >
        <input
          type="text"
          class="font-normal h-10"
          bind:value={string}
          on:input={() => (output = [])}
        />
        <button
          class="bg-green-500 size-10 grid place-items-center text-3xl text-white rounded-r-full"
          on:click={word_roll}
        >
          &#10162;
        </button>
      </div>
    </label>
    <label class="flex flex-col w-fit">Scramble<button type="button" class="text-4xl bg-green-500 size-12 rounded-xl border-2 border-black grid place-content-center" on:click={() => scramble(output)}>&#127922;</button></label>
  </form>
  {#if output.length === 0}
    <div class="flex gap-1 mt-4">
      {#each string.split("") as letter}
        <div>
          <button disabled class="size-14 text-5xl text-green-500 opacity-65"
            >&#9650;</button
          >
          <span
            class="spinner"
          >
            {letter}
          </span>
          <button disabled class="size-14 text-5xl text-green-500 opacity-65"
            >&#9660;</button
          >
        </div>
      {/each}
    </div>
  {/if}
    {#if output.length > 0}
      <div class="flex gap-1 mt-4">
        {#each string.split("") as _, i}
          <div>
            <button class="size-14 text-5xl text-green-500" on:click={() => next(i)}>&#9650;</button>
            <span
              class="spinner"
              data-before={output[sides-1][i]}
              data-after={output[1][i]}
            >
            {output[0][i]}
            </span>
            <button class="size-14 text-5xl text-green-500" on:click={() => prev(i)}>&#9660;</button>
          </div>
        {/each}
      </div>
    {/if}
</main>

<style lang="postcss">
  .spinner {
    @apply relative bg-orange-800 text-white text-3xl font-bold size-14 my-10 grid place-items-center;
  }
  .spinner::before {
    @apply size-14 bg-orange-700 absolute -top-full transform-style-3d rotate-x-[60deg] origin-bottom grid place-items-center;
    content: attr(data-before);
  }
  .spinner::after {
    @apply grid place-items-center bg-orange-900 absolute -bottom-full transform-style-3d rotate-x-[-60deg] origin-top size-14;
    content: attr(data-after);
  }
</style>