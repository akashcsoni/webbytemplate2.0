'use client';

import { useEffect, useState, useMemo } from 'react';

const componentCache = {}; // Optional: shared cache to prevent redundant imports

export default function GlobalComponent({ data }) {
    const [components, setComponents] = useState({});

    const componentList = useMemo(() => {
        return Array.isArray(data?.components) ? data.components : [];
    }, [JSON.stringify(data?.components)]); // Prevent unnecessary re-runs

    // Converts kebab-case or snake_case to PascalCase
    const convertToPascalCase = (str) => {
        return str
            .split(/[-_]/g)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join('');
    };

    useEffect(() => {
        if (!componentList.length) return;

        let isMounted = true;

        const loadComponents = async () => {
            const componentMap = {};

            for (const component of componentList) {
                const rawName = component.__component?.split('.')[1];
                if (!rawName) continue;

                const pascalCaseName = convertToPascalCase(rawName);

                try {
                    // Use cached component if already imported
                    if (!componentCache[pascalCaseName]) {
                        const { default: DynamicComponent } = await import(`../${pascalCaseName}`);
                        componentCache[pascalCaseName] = DynamicComponent;
                    }
                    componentMap[pascalCaseName] = componentCache[pascalCaseName];
                } catch (err) {
                    console.error(`Error loading component "${pascalCaseName}":`, err);
                }
            }

            if (isMounted) {
                setComponents(componentMap);
            }
        };

        loadComponents();
        return () => {
            isMounted = false;
        };
    }, [componentList]);

    const renderComponent = (component, index) => {
        const rawName = component.__component?.split('.')[1];
        if (!rawName) return null;

        const pascalCaseName = convertToPascalCase(rawName);
        const DynamicComponent = components[pascalCaseName];

        return DynamicComponent ? (
            <DynamicComponent key={index} {...component} />
        ) : null;
    };

    return (
        <div className="global-component">
            {componentList.map((component, index) => renderComponent(component, index))}
        </div>
    );
}