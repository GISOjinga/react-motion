import Object from '@rbxts/object-utils'
import React, { useEffect, useState } from '@rbxts/react'
import { TweenService } from '@rbxts/services'
import { AnimationTransition, AnimationVariants } from '.'


export default function useAnimation<T extends Instance>(
    variants: AnimationVariants<T>,
    ref: React.RefObject<T>,
    initial?:
        | keyof AnimationVariants<T>
        | (Partial<T> & {
              transition?: Partial<AnimationTransition>
          }),
    animate?:
        | keyof AnimationVariants<T>
        | (Partial<T> & {
              transition?: Partial<AnimationTransition>
          }),
    transition?: Partial<AnimationTransition>
): [string, (variant: string) => void] {
    const [variantState, setVariantState] = useState<
        | keyof AnimationVariants<T>
        | (Partial<T> & {
              transition?: Partial<AnimationTransition>
          })
    >();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const currentVariant = typeIs(variantState, 'string') ? variants[variantState] : variantState
    const animationVariant =
        animate !== undefined
            ? typeIs(animate, 'string')
                ? variants[animate]
                : animate
            : currentVariant
    
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    let animationProperties: Partial<T> = {}
    let mergedTransition: Partial<AnimationTransition> = {}
    
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    if(animationVariant) {
        animationProperties = Object.entries(animationVariant)
        .filter(([key]) => key !== 'transition')
        .reduce((acc, [key, value]) => {
            ;(acc as Record<string, unknown>)[key as string] = value
            return acc
        }, {} as Partial<T>)

        mergedTransition = {
            ...animationVariant.transition,
            ...transition
        }
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const element = ref.current
        if(!element) return

        Object.entries(initial ?? {}).forEach(([key, value]) => {
            if(key !== 'transition') {
                ;(element as Record<string, unknown>)[key as string] = value
            }
        })

        let tween: Tween | undefined;
        if(animationVariant) {
            tween = TweenService.Create(
                element,
                new TweenInfo(
                    mergedTransition.duration ?? 1,
                    mergedTransition.easingStyle ?? Enum.EasingStyle.Linear,
                    mergedTransition.easingDirection ?? Enum.EasingDirection.InOut,
                    mergedTransition.repeatCount ?? 0,
                    mergedTransition.reverses ?? false,
                    mergedTransition.delay ?? 0
                ),
                animationProperties
            )
    
            tween.Play()
        }

        return () => {
            tween?.Destroy()
        }
    }, [ref, variants, variantState, animate, transition])

    const setVariant = (variant: string) => {
        setVariantState(variant)
    }

    return [typeIs(variantState, 'string') ? variantState : '', setVariant]
}
