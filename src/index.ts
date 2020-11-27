console.log('Hello World')

type onSetType = (p: string, c: Function) => void

class Trap<T extends Object> {
    onSetCallback: Function
    proxy: any

    constructor(private object: T) {
      this.onSetCallback = () =>{}
    }

    onSet (propertyName:string, callback: Function) {
      console.log('>>>>', propertyName, callback);

      this.onSetCallback = callback
    }

    setup(){
      const that = this
      this.proxy = new Proxy<T>(this.object, {
        set(
          target: any,
          p: string | number | symbol,
          value: any,
          receiver: any
        ): boolean {
          console.log('Callback Called')
          if (that.onSetCallback) {
            that.onSetCallback()
          }
          return true
        },
      })
      return (this.proxy as T)
    }
}

type Music = {
  name: string
  author: string
}

const music: Music = {
  name: 'I walk alone',
  author: 'Tarja Turunen',
}

const trap = new Trap<Music>(music)
trap.onSet('name', function () {
  console.log('name changed')
})
const proxy = trap.setup()

setTimeout(function () {
  proxy.name = 'Die Alive'
}, 1000)

// proxy.onSet()

// .onSet('name', fn)
// .trap()
