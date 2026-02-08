--- 
sidebar_position: 2
title: 'Chapter 2: Inverse Kinematics'
---

# Chapter 2: Inverse Kinematics

In the previous chapter, we answered the question: "Given the joint angles, where is the end-effector?" Now, we address the opposite, and often more useful, problem. **Inverse Kinematics (IK)** is the process that answers this question:

> Given a desired position and orientation for the end-effector, what are the joint angles required to achieve it?

This is fundamental to robot control. To move a robot's hand to a specific point to pick up an object, the robot controller must solve the inverse kinematics problem.

## Challenges in Inverse Kinematics

Unlike forward kinematics, which always has a single, unique solution, inverse kinematics is more complex.

-   **Multiple Solutions:** A robot can often reach the same point in space with different postures. A common example is an "elbow-up" vs. "elbow-down" configuration. The controller must have a strategy for choosing one.
-   **No Solution:** If the target point is outside the robot's **workspace**, there is no possible set of joint angles to reach it.
-   **Singularities:** These are specific configurations where the robot loses one or more degrees of freedom, leading to unpredictable motion or the inability to move in a certain direction.
-   **Complexity:** The equations for solving IK are often non-linear and much more difficult to solve than the forward kinematics equations.

/img/placeholder.svg
*Fig 1: A 2-DOF arm can reach the target point (P) with two different solutions. (Placeholder image)*

## The Geometric Approach

For simple robots, especially those with few degrees of freedom, we can often solve the inverse kinematics problem using geometry and trigonometry. This approach involves projecting the robot's linkage onto a 2D plane and using rules like the Law of Cosines.

### Example: 2-DOF Planar Manipulator

Let's consider a simple 2-DOF planar arm with link lengths `L1` and `L2`. We want to place the end-effector at a point `(x, y)`.

![Elbow Up/Down Example](/img/placeholder.svg)
*Fig 2: Geometry for solving the IK of a 2-DOF planar arm. (Placeholder image)*

Using the Law of Cosines on the triangle formed by the origin, the point (x, y), and the elbow joint, we can solve for the second joint angle, `θ2`:

```latex
$x^2 + y^2 = L_1^2 + L_2^2 - 2 L_1 L_2 \cos(180^\circ - \theta_2)$
```

Since `cos(180 - a) = -cos(a)`, we can simplify and solve for `θ2`:

```latex
$\cos(\theta_2) = \frac{x^2 + y^2 - L_1^2 - L_2^2}{2 L_1 L_2}$
```

From this, `θ2` can be found:

```latex
$\theta_2 = \text{atan2}(\pm\sqrt{1 - \cos^2(\theta_2)}, \cos(\theta_2))$
```

The `±` indicates the two possible solutions (elbow-up and elbow-down).

Once `θ2` is known, `θ1` can be found by calculating the angle to the target point and subtracting the angle contributed by the second link.

```latex
$\theta_1 = \text{atan2}(y, x) - \text{atan2}(L_2 \sin(\theta_2), L_1 + L_2 \cos(\theta_2))$
```

## The Analytical Approach (Introduction)

For more complex robots, a purely geometric solution is often intractable. The analytical approach involves solving the chain of transformation matrices we derived in forward kinematics:

```latex
$^0_N T = \begin{bmatrix}
    r_{11} & r_{12} & r_{13} & p_x \\
    r_{21} & r_{22} & r_{23} & p_y \\
    r_{31} & r_{32} & r_{33} & p_z \\
    0 & 0 & 0 & 1
\end{bmatrix}$
```

Here, the desired position (`px, py, pz`) and orientation (`r_ij` values) are known. The equations for each element of the matrix are functions of the unknown joint angles (`θ_i`). Solving this system of non-linear trigonometric equations for the `θ` variables provides the solution. This is a very advanced topic and is typically only feasible for specific, well-structured robot designs.

This concludes our introduction to robot kinematics!
