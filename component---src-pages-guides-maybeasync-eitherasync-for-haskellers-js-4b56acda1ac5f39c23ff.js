webpackJsonp([0xaf8adc378e7c],{228:function(e,t,a){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var r=a(1),l=n(r),s=a(8),i=n(s),o=a(21),c=n(o),u=a(47),d=n(u),h=a(19),f=n(h),y=a(24),m=n(y),p=(i.default.div.withConfig({displayName:"maybeasync-eitherasync-for-haskellers__Note"})(["display:inline-block;background-color:#fcf4cd;border:0 solid #f7e070;border-left-width:8px;padding:10px;margin:10px 0;"]),i.default.a.withConfig({displayName:"maybeasync-eitherasync-for-haskellers__MethodName"})(["font-size:17px;font-weight:bold;color:#3b74d7;margin-top:5px;display:inline-block;text-decoration:none;&:hover{text-decoration:underline;}"]),function(e){return l.default.createElement(c.default,{location:e.location},l.default.createElement("h1",null,"MaybeAsync and EitherAsync for Haskellers"),"As mentioned in the description of those data types, MaybeAsync and EitherAsync are funky Promise-specialized monad transformers for Maybe and Either.",l.default.createElement("br",null),"Some things may feel out of place and that is completely intentional, porting monad transformers over to TypeScript was just not practical, especially the higher-kinded types and typeclasses part.",l.default.createElement("br",null),"A lot of thought went into designing the APIs and I believe that the result is satisfactory. In fact, even though the implementation is completely different, code written in mtl style looks pretty similar! Here, take a look:",l.default.createElement(f.default,{language:"haskell",style:m.default},"tryToInsertUser user = runExceptT $ do\n  validatedUser <- liftEither $ validateUser user\n  userExists <- lift $ doesUserAlreadyExist validatedUser\n\n  when userExists (throwE UserAlreadyExists)\n\n  maybeToExceptT ServerError $ do\n    updatedUser <- MaybeT $ hashPasswordInUser user\n    lift $ insertUser updatedUser"),"Keep in mind this code is not representative of the perfect or cleanest implementation for such a feature, I tried to shove as much functions, that are also possible in Maybe-EitherAsync, as I could.",l.default.createElement("br",null),"Here's the same logic implemented with purify in TypeScript:",l.default.createElement(f.default,{language:"typescript",style:m.default},"const tryToInsertUser = user =>\n  EitherAsync(async ({ liftEither, throwE, fromPromise }) => {\n    const validatedUser = await liftEither(validateUser(user))\n    const userExists = await doesUserAlreadyExist(validatedUser)\n\n    if (userExists) throwE('UserAlreadyExists')\n\n    return fromPromise(MaybeAsync(async ({ fromPromise }) => {\n        const updatedUser = await fromPromise(hashPasswordInUser(user))\n        return insertUser(updatedUser)\n    }).toEitherAsync('ServerError').run())\n  })"),"One important thing to understand about Maybe and EitherAsync is that the docs and the API create the illusion that code is running in some custom magical context that lets you safely unwrap values.",l.default.createElement("br",null),'Is it referred to as "MaybeAsync context" or "EitherAsync context", but in fact there\'s no magic and the only real context is the async/await block.',l.default.createElement("br",null),'That allows us to simulate do-notation using await and what those "lifting" function actually do is return Promises that get rejected when a value is missing. ',l.default.createElement("br",null),"The `run` function will later on catch all those rejections and return a proper Maybe/Either value.",l.default.createElement("h3",null,"Glossary of functions"),l.default.createElement("ul",null,l.default.createElement("li",null,"MaybeAsync<a>"," = MaybeT IO a"),l.default.createElement("li",null,"EitherAsync<e, a>"," = ExceptT e IO a"),l.default.createElement("li",null,"liftEither/Maybe = liftEither/Maybe (",l.default.createElement(d.default,null,"MaybeT/ExceptT . return")," in Haskell, but nothing like that in purify, they function the same though)"),l.default.createElement("li",null,"fromPromise = the MaybeT/ExceptT constructor (you only need to wrap the IO action with the newtype in Haskell, in purify it's not as simple)"),l.default.createElement("li",null,"throwE = throwE"),l.default.createElement("li",null,"MaybeAsync#toEitherAsync = maybeToExceptT (from the"," ",l.default.createElement("a",{href:"http://hackage.haskell.org/package/transformers-0.5.5.0/docs/Control-Monad-Trans-Maybe.html#v:maybeToExceptT"},"transformers package"),")"),l.default.createElement("li",null,"EitherAsync#toMaybeAsync = exceptToMaybeT")))});t.default=p,e.exports=t.default}});
//# sourceMappingURL=component---src-pages-guides-maybeasync-eitherasync-for-haskellers-js-4b56acda1ac5f39c23ff.js.map