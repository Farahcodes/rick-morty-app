export default defineAppConfig({
  ui: {
    badge: {
      compoundVariants: [
        {
          color: 'green',
          variant: 'subtle',
          class: 'bg-green-50 text-green-600 ring-1 ring-inset ring-green-600/10'
        },
        {
          color: 'red',
          variant: 'subtle',
          class: 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10'
        },
        {
          color: 'lovasoa',
          variant: 'subtle',
          class: 'bg-lovasoa-50 text-lovasoa-500 ring-1 ring-inset ring-lovasoa-500'
        }
      ]
    },
  },
}) 