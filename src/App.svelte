<script lang="ts">
let string: string = $state("january");
let output: string[][] = $state([]);
let sides: number = $state(8);
let charactersGroup: string[] = $state(["abcdefghijklmnopqrstuvwxyz"]);
let customCharacters: string = $state("");

//#region word_roll function
async function word_roll(e: Event) {
  e.preventDefault();
  console.log(charactersGroup);
  const characters = charactersGroup.join("") + customCharacters;
	const word_length = string.length;
	const word_roll_array = [string.toUpperCase()];
	for (let i = 1; i < sides; i++) {
		let word_roll = "";
		for (let j = 0; j < word_length; j++) {
			// create a random letter
			const random_letter = characters[Math.floor(Math.random() * characters.length)];
			// add the random letter to the word
			word_roll += random_letter;
		}
		word_roll_array.push(word_roll.toUpperCase());
	}
	output = await scramble(word_roll_array.map((word) => word.split("")));
}
// #endregion

//#region next and prev functions
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

function spinUp(i: number) {
	const spinWheel = document.getElementById(`spinWheel-${i}`);
	if (spinWheel) {
		const rotationAngle = 360 / sides;
		const prevRotation = spinWheel.style.transform;
		const prevRotationAngle = prevRotation
			? Number.parseInt(prevRotation.split("(")[1].split("d")[0])
			: 0;
		spinWheel.style.transform = `rotateX(${
			prevRotationAngle - rotationAngle
		}deg)`;
	}
}

function spinDown(i: number) {
	const spinWheel = document.getElementById(`spinWheel-${i}`);
	if (spinWheel) {
		const rotationAngle = 360 / sides;
		const prevRotation = spinWheel.style.transform;
		const prevRotationAngle = prevRotation
			? Number.parseInt(prevRotation.split("(")[1].split("d")[0])
			: 0;
		spinWheel.style.transform = `rotateX(${
			rotationAngle + prevRotationAngle
		}deg)`;
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
//#endregion

//#region scramble function
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
//#endregion
</script>

<main class="">
  <!-- MARK: input form -->
  <form onsubmit={word_roll} class="mx-auto w-fit flex gap-4">
    <label for="sides" class="flex flex-col text-xl font-bold w-fit">
      Sides:
      <select
        class="font-bold text-xl border-2 border-black rounded-full"
        bind:value={sides}
        onchange={() => (output = [])}
      >
        {#each [4, 6, 8, 10, 12, 20] as side}
          <option value={side}>{side}</option>
        {/each}
      </select>
    </label>
    <label for="string" class="flex flex-col text-xl font-bold w-fit"
      >Input word:
      <div
        class="flex border-2 border-black rounded-r-full divide-x-2 divide-black"
      >
        <input
          type="text"
          class="font-normal"
          bind:value={string}
          oninput={() => (output = [])}
        />
        <button
          class="bg-green-500 w-10 grid place-items-center text-3xl text-white rounded-r-full"
          onclick={word_roll}
        >
          &#10162;
        </button>
      </div>
    </label>
    <label class="flex flex-col w-fit">Scramble<button type="button" class="text-4xl bg-green-500 size-12 rounded-xl border-2 border-black grid place-content-center" onclick={() => scramble(output).then(res => (output = res))}>&#127922;</button></label>
  </form>
    <div class="w-full min-w-0 characters">
      <label>
        <input type="checkbox" bind:group={charactersGroup} value="abcdefghijklmnopqrstuvwxyz" checked>
        a-z
      </label>
      <label>
        <input type="checkbox" bind:group={charactersGroup} value="0123456789">
        0-9
      </label>
      <label>
        <input type="checkbox" bind:group={charactersGroup} value="!@#$%^&*()_+">
        special characters
      </label>
      <label class="col-span-3 mx-auto">
        <input type="text" id="customCharacters" bind:value={customCharacters}>
        custom characters
      </label>
    </div>
  <!-- MARK: fake spinner -->
  {#if output.length === 0}
    <div class="flex gap-1 mt-4 mx-auto w-fit">
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
      <div class="relative w-fit h-fit mx-auto">
        <hr class="border-4 border-black absolute -left-4 -right-4 rounded-full top-1/2 z-[9999] opacity-20">
        <div class="flex gap-1 mt-4">
          {#each string.split("") as _, i}
          <!-- MARK: old spinner -->
            <!-- <div>
              <button class="size-14 text-5xl text-green-500" on:click={() => next(i)}>&#9650;</button>
              <span
                class="spinner"
                data-before={output[sides-1][i]}
                data-after={output[1][i]}
              >
              {output[0][i]}
              </span>
              <button class="size-14 text-5xl text-green-500" on:click={() => prev(i)}>&#9660;</button>
            </div> -->
          <!-- MARK: new spinner -->
            <div class="spinWheelContainer">
              <button class="size-14 text-5xl text-green-500" onclick={() => spinUp(i)}>&#9650;</button>
              <div id={`spinWheel-${i}`} class="spinWheel" style={
                `margin-top: ${(56 * ((sides / 4 - 1 ) * 0.7))}px;
                 margin-bottom: ${(56 * (( sides / 4 - 1 )) * 0.7)}px;`
              }>
                {#each output.map((x) => x[i]) as letter, index}
                {@const rotationAngle = 360 / sides * (index)}
                  <span class="absolute size-14 min-h-14 text-3xl bg-orange-800 text-white grid place-items-center transform-style-3d border-b-2 border-black" style={
                    `transform: rotateX(${rotationAngle}deg) translateZ(${7 * sides}px);`
                  }>{letter}</span>
                {/each}
              </div>
              <button class="size-14 text-5xl text-green-500" onclick={() => spinDown(i)}>&#9660;</button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
</main>

<!-- MARK: CSS -->
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

  .spinWheelContainer {
    @apply grid place-items-center relative;
  }

  .spinWheel {
    @apply grid place-items-center size-14 relative transform-style-3d transition-transform;
  }

  .characters {
    @apply grid grid-cols-3 gap-4 w-fit min-w-0 mx-auto mt-4;

    label {
      @apply flex gap-2 w-fit text-xl mx-auto;
    }

    input[type="text"] {
      @apply border-2 border-black rounded-lg;
    }
  }

  input[type="checkbox"] {
    @apply size-7 rounded-lg;
  }
</style>