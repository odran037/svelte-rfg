<script>
  import { onMount } from 'svelte';
  import Axios from 'axios';
  import Actions from './Actions.svelte';
  import { favoritesList } from './stores.js';

  const BASE_URL = (factType) => `http://numbersapi.com/random/${factType}`;
  const FACT_TYPES = ['math', 'date', 'year', 'trivia'];

  const actionButtons = {
    labels: FACT_TYPES,
    method: getRandomFact
  }

  let showHideFavorites = true;
  let currentFact = '';
  let isFavorite = false;
  let favoriteIcon = (color) => `<span class="${color}-heart">&hearts;</span>`;

  function getRandomFact(factType) {
    let random = Math.floor(Math.random() * 4);
    let randomType = FACT_TYPES[random];
    let url = BASE_URL(factType ? factType : randomType);

    Axios
      .get(url)
      .then(({data}) => {
        currentFact = data;
        isFavorite = false;
      })
      .catch(error => {
        currentFact = '<small class="error">Unable to retrieve fact.</small>';
        console.error(error);
      });
  }

  onMount(async () => {
		getRandomFact();
    favoritesList.load();
	});
</script>

<main>
  <Actions {...actionButtons}/>

  <h1>
    {@html currentFact}

    {#if isFavorite}
      <span>
        {@html favoriteIcon('red')}
      </span>
    {:else}
      <span on:click={() => {
        isFavorite = !isFavorite;
        favoritesList.add(currentFact);
      }}>
        {@html favoriteIcon('black')}
      </span>
    {/if}
  </h1>

  <button on:click={() => showHideFavorites = !showHideFavorites}>
    {showHideFavorites ? 'Hide' : 'Show'} Favorites
  </button>

  {#if showHideFavorites}
    <ul>
      {#if $favoritesList.length > 0}
        {#each $favoritesList as fav}
          <li>
            <p>{fav}</p>
            <span
              class="remove"
              on:click={() => {
                favoritesList.remove(fav);
                if (fav == currentFact) {
                  isFavorite = false;
                }
              }}
            >
              x
            </span>
          </li>
        {/each}
      {:else}
        <li>No favorites</li>
      {/if}
    </ul>
  {/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 140px;
		margin: 15px auto;
	}

  ul {
    text-align: left;
  }

	@media (min-width: 640px) {
		main {
			max-width: 75%;
		}
	}
</style>