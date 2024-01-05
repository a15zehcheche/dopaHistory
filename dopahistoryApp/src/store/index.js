import { createStore } from 'vuex';
const store = createStore({
  state() {
    return {
      app: {
        lastTimeCheck: '03/01/2024',
        startDay:'20/12/2023'
      },
      dopamines: [
        {
          name: "Dopamines",
          recordLastThinkDay: 0,
          recordLastDoDay: 0,
          actualLastThinkDay: 0,
          actualLastDoDay: 0,
          days:1,
          history: [
            {
              datetime: '05/01/2024',
              thinkCount: 0,
              doCount: 0,
              lastThinkDay: 1,
              lastDoDay: 3,
            },
            {
              datetime: '04/01/2024',
              thinkCount: 1,
              doCount: 0,
              lastThinkDay: 2,
              lastDoDay: 0,
            },
            {
              datetime: '02/01/2024',
              thinkCount: 1,
              doCount: 1,
              lastThinkDay: 1,
              lastDoDay: 8,
            },
            {
              datetime: '01/01/2024',
              thinkCount: 1,
              doCount: 0,
              lastThinkDay: 7,
              lastDoDay: 0,
            },
            {
              datetime: '25/12/2023',
              thinkCount: 1,
              doCount: 1,
              lastThinkDay: 5,
              lastDoDay: 5,
            },
            {
              datetime: '20/12/2023',
              thinkCount: 0,
              doCount: 0,
              lastThinkDay: 0,
              lastDoDay: 0,
            }
          ]
        }
      ],
      memories: [
        {
          id: 'm1',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Mighty_Mountains_with_Snow.jpg/640px-Mighty_Mountains_with_Snow.jpg',
          title: 'A trip into the mountains',
          description: 'It was a really nice trip!',
        },
        {
          id: 'm2',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/A_surfer_surfing_on_the_ocean_%28Unsplash%29.jpg/640px-A_surfer_surfing_on_the_ocean_%28Unsplash%29.jpg',
          title: 'Surfing the sea side',
          description: 'Feeling the cool breeze',
        },
        {
          id: 'm3',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Indian_-_Food.jpg/640px-Indian_-_Food.jpg',
          title: 'Good eating',
          description: 'Really tasty!',
        },
      ],
    };
  },
  mutations: {
    addMemory(state, memoryData) {
      const newMemory = {
        id: new Date().toISOString(),
        title: memoryData.title,
        image: memoryData.imageUrl,
        description: memoryData.description
      };

      state.memories.unshift(newMemory);
    }
  },
  actions: {
    addMemory(context, memoryData) {
      context.commit('addMemory', memoryData);
    }
  },
  getters: {
    memories(state) {
      return state.memories;
    },
    memory(state) {
      return (memoryId) => {
        return state.memories.find((memory) => memory.id === memoryId);
      };
    },
  },
});

export default store;
