// import { FaInfoCircle } from "react-icons/fa";

// const ProjectRequirementsFields = ({
//   selectedCategory,
//   loadingFields,
//   categoryFields,
//   formValues,
//   onChangeValue,
//   errors,
//   prevStep,
//   submitting,
// }) => {
//   const categoryName = selectedCategory ? selectedCategory.replaceAll("_", " ") : "";

//   if (loadingFields) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan" />
//         <span className="ml-3 text-gray-600">Cargando campos...</span>
//       </div>
//     );
//   }

//   if (categoryFields.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-500">No hay campos configurados para esta categoría.</p>
//         <div className="flex gap-4 mt-6">
//           <button
//             onClick={prevStep}
//             className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all"
//           >
//             Anterior
//           </button>
//           <button
//             type="submit"
//             className="bg-cyan hover:bg-cyan-medium text-white font-semibold px-8 py-3 rounded-lg transition-all"
//           >
//             {submitting ? "Enviando..." : "Enviar"}
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h3 className="text-lg font-semibold text-navy">
//         Requisitos para: <span className="text-cyan">{categoryName}</span>
//       </h3>
      
//       <div className="grid grid-cols-1 gap-6">
//         {categoryFields.map((f) => (
//           <div key={f.field_name} className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
//               {f.label}
//               {f.required && <span className="text-cyan">*</span>}
//               {f.field_name === "cms" && (
//                 <div className="group relative">
//                   <FaInfoCircle className="w-4 h-4 text-cyan cursor-help" />
//                   <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-navy text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
//                     Un CMS (Sistema de Gestión de Contenidos) es una plataforma como WordPress, Shopify, Joomla, etc.
//                   </div>
//                 </div>
//               )}
//             </label>

//             {f.type === "text" && (
//               <input
//                 id={f.field_name}
//                 type="text"
//                 required={f.required}
//                 value={formValues[f.field_name] ?? ""}
//                 onChange={(e) => onChangeValue(f.field_name, e.target.value)}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
//               />
//             )}

//             {f.type === "number" && (
//               <input
//                 id={f.field_name}
//                 type="number"
//                 required={f.required}
//                 value={formValues[f.field_name] ?? ""}
//                 onChange={(e) => onChangeValue(f.field_name, e.target.value)}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700"
//               />
//             )}

//             {f.type === "boolean" && (
//               <div className="flex gap-6">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name={f.field_name}
//                     value="true"
//                     required={f.required}
//                     checked={formValues[f.field_name] === true}
//                     onChange={() => onChangeValue(f.field_name, true)}
//                     className="w-4 h-4 text-cyan border-gray-300 focus:ring-cyan"
//                   />
//                   <span className="text-gray-700">Sí</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="radio"
//                     name={f.field_name}
//                     value="false"
//                     required={f.required}
//                     checked={formValues[f.field_name] === false}
//                     onChange={() => onChangeValue(f.field_name, false)}
//                     className="w-4 h-4 text-cyan border-gray-300 focus:ring-cyan"
//                   />
//                   <span className="text-gray-700">No</span>
//                 </label>
//               </div>
//             )}

//             {f.type === "textarea" && (
//               <textarea
//                 id={f.field_name}
//                 rows={4}
//                 required={f.required}
//                 value={formValues[f.field_name] ?? ""}
//                 onChange={(e) => onChangeValue(f.field_name, e.target.value)}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition-all text-gray-700 resize-none"
//               />
//             )}

//             {f.type === "select" && (
//               <select
//                 id={f.field_name}
//                 required={f.required}
//                 value={formValues[f.field_name] ?? ""}
//                 onChange={(e) => onChangeValue(f.field_name, e.target.value)}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none bg-white transition-all text-gray-700"
//               >
//                 <option value="">Selecciona...</option>
//                 {Array.isArray(f.options) &&
//                   f.options.map((opt, idx) => (
//                     <option key={idx} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//               </select>
//             )}

//             {errors[f.field_name] && (
//               <p className="text-red-500 text-sm">{errors[f.field_name]}</p>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="flex gap-4 pt-6">
//         <button
//           type="button"
//           onClick={prevStep}
//           className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-lg transition-all"
//         >
//           Anterior
//         </button>
//         <button
//           type="submit"
//           disabled={submitting}
//           className="bg-cyan hover:bg-cyan-medium disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all flex items-center gap-2"
//         >
//           {submitting && (
//             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//           )}
//           {submitting ? "Enviando..." : "Solicitar consulta gratuita"}
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectRequirementsFields;
