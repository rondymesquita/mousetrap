import Trap from './'

type Music = {
  name: string
  author: string
}

describe('Trap behaviors', function () {
  let music: Music

  beforeEach(function () {
    music = {
      name: 'I walk alone',
      author: 'Tarja Turunen',
    }
  })
  describe('When creating a new instance', function () {
    it('Should create new trap for passed object', function () {
      const trap = new Trap<Music>(music)
      expect(trap).not.toBeNull()
    })
    it('Should setup the proxy when calling setup function', function () {
      const trap = new Trap<Music>(music)
      const onSetStub = jest.fn()
      trap.onSet('name', onSetStub)

      expect(trap.proxy).toBeUndefined()
      const proxy = trap.setup()
      expect(trap.proxy).not.toBeUndefined()
    })
  })

  describe('When subscribing for changing properties', function () {
    it('Should add set callback', function () {
      const trap = new Trap<Music>(music)
      expect(trap.onSetCallbacks.length).toEqual(0)
      trap.onSet('name', function () {})
      expect(trap.onSetCallbacks.length).toEqual(1)
      expect(trap.onSetCallbacks[0]).not.toBeUndefined()
      expect(typeof trap.onSetCallbacks[0]).toEqual('object')
      expect(trap.onSetCallbacks[0].propertyName).toEqual('name')
      expect(typeof trap.onSetCallbacks[0].callback).toEqual('function')
    })
    it('Should call a callback when changing a property', function () {
      const trap = new Trap<Music>(music)
      const onSetStub = jest.fn()
      trap.onSet('name', onSetStub)

      expect(onSetStub).not.toHaveBeenCalled()
      const proxy = trap.setup()

      proxy.name = 'Die Alive'
      expect(onSetStub).toHaveBeenCalledTimes(1)
      expect(onSetStub).toHaveBeenNthCalledWith(1)
    })
    it('Should not call callback when changing a property that was not subscribed', function () {
      const trap = new Trap<Music>(music)
      const onSetStub = jest.fn()
      trap.onSet('genre', onSetStub)

      expect(onSetStub).not.toHaveBeenCalled()
      const proxy = trap.setup()

      proxy.name = 'Die Alive'
      expect(onSetStub).not.toHaveBeenCalled()
    })
    it('Should call all callbacks when changing given properties', function () {
      const trap = new Trap<Music>(music)
      const onSetNameStub = jest.fn()
      const onSetGenreStub = jest.fn()
      trap.onSet('name', onSetNameStub)
      trap.onSet('author', onSetGenreStub)

      expect(onSetNameStub).not.toHaveBeenCalled()
      expect(onSetGenreStub).not.toHaveBeenCalled()
      const proxy = trap.setup()

      proxy.name = 'Nemo'
      proxy.author = 'Nightwish'
      expect(onSetNameStub).toHaveBeenCalledTimes(1)
      expect(onSetNameStub).toHaveBeenNthCalledWith(1)
      expect(onSetGenreStub).toHaveBeenCalledTimes(1)
      expect(onSetGenreStub).toHaveBeenNthCalledWith(1)
    })
    it('Should call callback when changing any property', function () {
      const trap = new Trap<Music>(music)
      const onSetStub = jest.fn()
      trap.onSetAny(onSetStub)

      expect(onSetStub).not.toHaveBeenCalled()
      const proxy = trap.setup()

      proxy.name = 'Nemo'
      expect(onSetStub).toHaveBeenCalledTimes(1)
      expect(onSetStub).toHaveBeenNthCalledWith(1)

      proxy.author = 'Nightwish'
      expect(onSetStub).toHaveBeenCalledTimes(2)
      expect(onSetStub).toHaveBeenNthCalledWith(2)
    })
  })
})
