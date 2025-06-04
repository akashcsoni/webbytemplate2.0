"use client"

import { useEffect, useState, useMemo } from "react"
import PageLoader from "../common/page-loader/PageLoader"

const componentCache = {} // Optional: shared cache to prevent redundant imports

export default function GlobalComponent({ data, params = {} }) {
    const [components, setComponents] = useState({})
    const [loading, setLoading] = useState(true)

    // Safely extract componentList from data
    const componentList = useMemo(() => {
        return Array.isArray(data?.components) ? data.components : []
    }, [data?.components])

    // Converts kebab-case or snake_case to PascalCase
    const convertToPascalCase = (str) => {
        return str
            .split(/[-_]/g)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join("")
    }

    useEffect(() => {
        let isMounted = true

        const loadComponents = async () => {
            // Safety check - ensure componentList is an array
            if (!Array.isArray(componentList)) {
                console.error("componentList is not an array:", componentList)
                if (isMounted) setLoading(false)
                return
            }

            const componentMap = {}

            for (const component of componentList) {
                if (!component || !component.__component) continue

                const rawName = component.__component?.split(".")[1]
                if (!rawName) continue

                const pascalCaseName = convertToPascalCase(rawName)

                try {
                    // Use cached component if already imported
                    if (!componentCache[pascalCaseName]) {
                        const { default: DynamicComponent } = await import(`../${pascalCaseName}`)
                        componentCache[pascalCaseName] = DynamicComponent
                    }
                    componentMap[pascalCaseName] = componentCache[pascalCaseName]
                } catch (err) {
                    console.error(`Error loading component "${pascalCaseName}":`, err)
                }
            }

            if (isMounted) {
                setComponents(componentMap)
                setLoading(false)
            }
        }

        // Set loading to true at the start
        setLoading(true)
        loadComponents()

        return () => {
            isMounted = false
        }
    }, [componentList])

    const renderComponent = (component, index) => {
        if (!component || !component.__component) return null

        const rawName = component.__component?.split(".")[1]
        if (!rawName) return null

        const pascalCaseName = convertToPascalCase(rawName)
        const DynamicComponent = components[pascalCaseName]
        return DynamicComponent ? <DynamicComponent key={index} {...component} params={params} /> : null
    }

    return (
        <div className="global-component h-full">
            {loading ? (
                <PageLoader />
            ) : (
                Array.isArray(componentList) && componentList.map((component, index) => renderComponent(component, index))
            )}
        </div>
    )
}
