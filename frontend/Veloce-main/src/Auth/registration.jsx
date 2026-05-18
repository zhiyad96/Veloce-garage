
import React, { useState, useRef, useMemo, useLayoutEffect, forwardRef, useEffect } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../service/api";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";

// ---------------- SILK BACKGROUND ----------------
const hexToNormalizedRGB = (hex) => {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
  float pattern = 0.6 + 0.4 * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) + sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}`;

const SilkPlane = forwardRef(({ uniforms }, ref) => {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref.current) ref.current.scale.set(viewport.width, viewport.height, 1);
  }, [ref, viewport]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
});

const Silk = ({ speed = 3, scale = 2, color = '#555555', noiseIntensity = 1.2, rotation = 0.2 }) => {
  const meshRef = useRef();
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation]
  );

  return (
    <Canvas dpr={[1, 2]} frameloop="always">
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
};








// ---------------- REGISTRATION COMPONENT ----------------
export default function Registration() {
  const [showpass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  };
  const validation = yup.object({
    username: yup.string().min(2, "Name too short").max(50, "Too long").required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    phone_number: yup.string().required("Phone number required"),
    password: yup
      .string()
      .min(6, "Min 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain uppercase, lowercase, number")
      .required("Required"),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Required"),
  });

  const register = async (values, { setSubmitting, resetForm }) => {
    try {
      const newUser = {
        username: values.username,
        email: values.email,
        phone_number: values.phone_number,
        password: values.password
      };
      await api.post("/register/", newUser);
      toast.success("Registered successfully!");
      resetForm();
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.email?.[0] || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" pt-20 relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Silk />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/10 blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex justify-center items-center px-4">
        <div
          className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 
          shadow-[0_0_40px_rgba(255,255,255,0.2)] rounded-2xl p-8 
          transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
        >
          <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">
            Create Account
          </h1>

          <Formik initialValues={initialValues} validationSchema={validation} onSubmit={register}>
            {({ touched, errors, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <Field
                    name="username"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200
                      ${errors.name && touched.name
                        ? "border-red-500 focus:ring-red-300"
                        : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <ErrorMessage name="username" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200
                      ${errors.email && touched.email
                        ? "border-red-500 focus:ring-red-300"
                        : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone:</label>
                  <Field
                    name="phone_number"
                    type="text"
                    placeholder="Enter your phone number"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200
                      ${errors.phone_number && touched.phone_number
                        ? "border-red-500 focus:ring-red-300"
                        : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <ErrorMessage name="phone_number" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-white mb-2">Password</label>
                  <Field
                    name="password"
                    type={showpass ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200 pr-10
                      ${errors.password && touched.password
                        ? "border-red-500 focus:ring-red-300"
                        : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showpass)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showpass ? "Hide" : "Show"}
                  </button>
                  <ErrorMessage name="password" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                  <Field
                    name="confirmPassword"
                    type={showpass ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200
                      ${errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500 focus:ring-red-300"
                        : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-600/80 hover:bg-gray-700/90 text-white p-3 rounded-lg font-semibold 
                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Account..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center pt-6 border-t border-white/10">
            <p className="text-gray-200">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-400 font-semibold hover:text-blue-300 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

















