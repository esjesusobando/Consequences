import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useCallback } from 'react';

/**
 * Hook para detectar intersecciones en la escena 3D.
 * Retorna una función que, dadas coordenadas de pantalla, devuelve el objeto 3D intersectado.
 */
export const useSelectionRaycaster = () => {
  const { camera, scene } = useThree();

  const getIntersections = useCallback(
    (clientX: number, clientY: number) => {
      const mouse = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      // Normalizar coordenadas de pantalla (-1 a +1)
      mouse.x = (clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Intersectar con todos los objetos visibles
      const intersects = raycaster.intersectObjects(scene.children, true);

      // Filtrar solo objetos con geometría (mallas) y excluir el grid/estrellas si es necesario
      return intersects.filter((i) => i.object.type === 'Mesh');
    },
    [camera, scene]
  );

  return getIntersections;
};