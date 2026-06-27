---
name: compositions
description: Defining compositions, stills, folders, default props and dynamic metadata
metadata:
  tags: composition, still, folder, props, metadata
sota_upgraded: true
---

A `<Composition>` defines the component, width, height, fps and duration of a renderable video.

It normally is placed in the `src/Root.tsx` file.

```tsx
import {Composition} from 'remotion';
import {MyComposition} from './MyComposition';

export const RemotionRoot = () => {
  return <Composition id="MyComposition" component={MyComposition} durationInFrames={100} fps={30} width={1080} height={1080} />;
};
```

## Default Props

Pass `defaultProps` to provide initial values for your component.
Values must be JSON-serializable (`Date`, `Map`, `Set`, and `staticFile()` are supported).

```tsx
import {Composition} from 'remotion';
import {MyComposition, MyCompositionProps} from './MyComposition';

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={
        {
          title: 'Hello World',
          color: '#ff0000',
        } satisfies MyCompositionProps
      }
    />
  );
};
```

Use `type` declarations for props rather than `interface` to ensure `defaultProps` type safety.

## Folders

Use `<Folder>` to organize compositions in the sidebar.
Folder names can only contain letters, numbers, and hyphens.

```tsx
import {Composition, Folder} from 'remotion';

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Marketing">
        <Composition id="Promo" /* ... */ />
        <Composition id="Ad" /* ... */ />
      </Folder>
      <Folder name="Social">
        <Folder name="Instagram">
          <Composition id="Story" /* ... */ />
          <Composition id="Reel" /* ... */ />
        </Folder>
      </Folder>
    </>
  );
};
```

## Stills

Use `<Still>` for single-frame images. It does not require `durationInFrames` or `fps`.

```tsx
import {Still} from 'remotion';
import {Thumbnail} from './Thumbnail';

export const RemotionRoot = () => {
  return <Still id="Thumbnail" component={Thumbnail} width={1280} height={720} />;
};
```

## Calculate Metadata

Use `calculateMetadata` to make dimensions, duration, or props dynamic based on data.

```tsx
import {Composition, CalculateMetadataFunction} from 'remotion';
import {MyComposition, MyCompositionProps} from './MyComposition';

const calculateMetadata: CalculateMetadataFunction<MyCompositionProps> = async ({props, abortSignal}) => {
  const data = await fetch(`https://api.example.com/video/${props.videoId}`, {
    signal: abortSignal,
  }).then((res) => res.json());

  return {
    durationInFrames: Math.ceil(data.duration * 30),
    props: {
      ...props,
      videoUrl: data.url,
    },
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100} // Placeholder, will be overridden
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{videoId: 'abc123'}}
      calculateMetadata={calculateMetadata}
    />
  );
};
```

The function can return `props`, `durationInFrames`, `width`, `height`, `fps`, and codec-related defaults. It runs once before rendering begins.

## Nesting compositions within another

To add a composition within another composition, you can use the `<Sequence>` component with a `width` and `height` prop to specify the size of the composition.

```tsx
<AbsoluteFill>
  <Sequence width={COMPOSITION_WIDTH} height={COMPOSITION_HEIGHT}>
    <CompositionComponent />
  </Sequence>
</AbsoluteFill>
```


---
## 🧠 SOTA Upgrade: Chain of Thought & System Constraints (v5.0)

> [!IMPORTANT]
> **Auto-Injected SOTA Rules:** Para asegurar un performance de estado del arte (SOTA), el Agente debe seguir estas directrices al ejecutar este skill:

1. **Plan-First (CoT)**: Antes de generar código o respuestas definitivas, debes explicar tu lógica paso a paso. Piensa en voz alta.
2. **No Data Loss**: Nunca elimines información valiosa al modificar archivos. Si refactorizas, documenta o comenta lo que quitas si tiene valor semántico.
3. **Strict Validation**: Verifica que el resultado final cumple con todas las validaciones de tipos y convenciones de este OS (ej. `Snake_Case`, Type Hints en Python).
4. **Context Awareness**: Asegúrate de mantener la coherencia con `Context_Memory.md` y `task.md`.

*Upgraded by 35_SOTA_Skill_Modernizer.py on 2026-06-27*
